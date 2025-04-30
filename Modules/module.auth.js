import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();

import { Redis } from "ioredis";
import { Users } from "./Database/module.db.js";
import { debugMessage, debugError, DEBUG } from "./module.debugHelpers.js";
import { Sequelize } from "sequelize";
import { generateUsername } from "./module.usernameGenerator.js";

// TODO: Some things to note about proper session auth. Firstly, We could only let tokens be valid for a max of 4 hours. We should refresh the token every time the user makes a request.
// Or in other words, we sign out the user after 4 hours of inactivity

//Helper function to connect to Redis. Done this way to propeply handle connection errors.

const connectToRedis = async () => {
    if (process.env.DEBUG === "true") {
        var redis = new Redis(process.env.REDIS_URL);
        redis.on("error", (error) => {
            //when error event is emitted, log the error
            debugError(error);
        });

        redis.on("connect", () => {
            //When connected, log the connection
            debugMessage("Connected to Redis");
        });
        return redis;
    } else {
        const cluster = new Redis.Cluster(
            [
                {
                    host: "user-session-4uvyfj.serverless.usw1.cache.amazonaws.com",
                    port: 6379,
                },
                // If you have multiple nodes, you can list them here
            ],
            {
                // ioredis cluster-level config here
                redisOptions: {
                    tls: { rejectUnauthorized: false },
                },
            }
        );

        // Now you can use the cluster normally
        (async () => {
            try {
                await cluster.set("myKey", "myValue");
                const result = await cluster.get("myKey");
                console.log(result); // 'myValue'
            } catch (err) {
                console.error("Error with ioredis cluster:", err);
            }
        })();
        return cluster;
    }
};

const auth = {
    //Redis Handle. This is used to store session tokens.
    sessionDB: await connectToRedis(),

    //Function to send a session token to the user.
    SendToken: async (res, user) => {
        const sessionToken = crypto.randomBytes(32).toString("hex");

        try {
            //set [sessionToken] = profile_id, expire in [TOKEN_EXP] seconds
            await auth.sessionDB.set(
                sessionToken,
                JSON.stringify(user),
                "EX",
                Number(process.env.TOKEN_EXP)
            );
        } catch (error) {
            return res.status(500).json({
                okay: false,
                error: "Unhandled exception",
                message: "The server encountered an unexpected condition",
            });
        }
        //Set the session token as a cookie.

        res.cookie("sessionToken", sessionToken, {
            maxAge: Number(process.env.TOKEN_EXP) * 1000,
            httpOnly: true,
            sameSite: "lax", // Must be "none" for cross-origin
            secure: DEBUG ? false : true, // Must be true when sameSite is "none"
            path: "/", // Apply to all paths
        });

        // Add debug logging
        console.log(
            "Set-Cookie header after setting:",
            res.getHeader("Set-Cookie")
        );
        //If in debug mode, return the user object with the session token so that it can be used for testing.

        if (DEBUG) {
            res.status(200).json({
                user: {
                    okay: true,
                    profile_id: user.profile_id,
                    email: user.email,
                    password: user.password,
                    session_token: sessionToken,
                    username_base: user.username_base,
                    username_suffix: user.username_suffix,
                },
            });
        } else {
            //If not in debug mode, just return a 200 status code.
            res.status(200).json({
                okay: true,
                message: "Logged in",
                redirect: "/app",
            });
        }
    },

    Signup: async (req, res) => {
        //Extract email and password from request body
        const { email, password, username } = req.body;
        //Check if email and password are present
        if (!email || !password || !username)
            return res.status(400).json({
                okay: false,
                error: "Bad request",
                message: "Missing email or password or username",
            });
        //Try to check if a user exists with the same email
        const userExists = await (async () => {
            try {
                debugMessage("Auth: BP 1, Line 56"); // Debug message used for testing

                const user = await Users.findOne({
                    where: { email },
                });

                debugMessage("Auth: BP 2, Line 60");
                debugMessage(`${!user}, Line 61`);

                return user ? true : false; //return a boolean value if the user exists
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    okay: false,
                    error: "Unhandled exception",
                    message: "The server encountered an unexpected condition",
                });
                throw error; // throw an error if the user does not exist. Usually we would want to return res, however in this case we want to throw an error.
            }
        })();

        //Check if the user exists
        if (userExists)
            return res.status(409).json({
                okay: false,
                error: "Request conflict",
                message: "Account with email already exists",
            });
        //Hash the password
        const hash = await bcrypt.hash(password, 10);
        //Generate a profile_id
        const profile_id = uuidv4();

        debugMessage("Auth: BP 4, Line 103");
        //Generate a username
        const usernameObj = await generateUsername(Users, username);
        if (!usernameObj) {
            return res.status(500).json({
                okay: false,
                error: "Unhandled exception",
                message: "Could not generate username",
            });
        }
        //Try to send the user to the database
        try {
            const user = await Users.create({
                profile_id,
                email,
                hash,
                username_base: usernameObj.username_base,
                username_suffix: usernameObj.username_suffix,
            });
            debugMessage(user);
        } catch (error) {
            if (error.errors[0].message === "email must be unique") {
                return res.status(409).json({
                    okay: false,
                    error: "Request conflict",
                    message: "Account with email already exists",
                });
            }

            if (error instanceof Sequelize.ValidationError) {
                console.log(error.message);
                return res.status(400).json({
                    okay: false,
                    error: "Invalid input",
                    message: error.message,
                });
            }

            res.status(500).json({
                okay: false,
                error: "Unhandled exception",
                message: "The server encountered an unexpected condition",
            });
            console.log(error);
            return;
        }

        //Generate a session token and send to the user
        auth.SendToken(res, {
            profile_id,
            email,
            password,
            username_base: usernameObj.username_base,
            username_suffix: usernameObj.username_suffix,
        });
    },

    Login: async (req, res) => {
        //Extract email and password from request body
        const { email, password } = req.body;

        //Check if email and password are present
        if (!email || !password)
            return res.status(400).json({
                okay: false,
                error: "Bad request",
                message: "Missing email or password",
            });

        //Try to find a user with the same email
        const user = await (async () => {
            try {
                const user = await Users.findOne({
                    where: { email },
                });
                if (!user) return null;

                return user;
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    okay: false,
                    error: "Unhandled exception",
                    message: "The server encountered an unexpected condition",
                });
                return null;
            }
        })();

        // Check if db actually returns a response or was found
        if (!user) {
            return res.status(401).json({
                okay: false,
                error: "Invalid credentials",
                message: "Password or email is incorrect",
            });
        }

        const hashedPassword = user.hash;
        const match = await bcrypt.compare(password, hashedPassword);

        //check if password matches.
        if (!match) {
            return res.status(401).json({
                okay: false,
                error: "Invalid credentials",
                message: "Password or email is incorrect",
            });
        }

        //Generate session token
        auth.SendToken(res, {
            profile_id: user.profile_id,
            email,
            password,
            username_base: user.username_base,
            username_suffix: user.username_suffix,
        });
    },

    Logout: async (req, res) => {
        //Get session token from cookie
        const token = req.cookies.sessionToken;
        //Check if token is present
        if (!token) {
            return res.status(400).json({
                okay: false,
                error: "Bad request",
                message: "Missing session token",
            });
        }

        //Try to delete the session token from the database
        try {
            await auth.sessionDB.del(token);
        } catch (error) {
            debugError(error);
            res.status(500).json({
                okay: false,
                error: "Unhandled exception",
                message: "The server encountered an unexpected condition",
            });
        }

        //respond by clearing the cookie and sending a confirmation message
        return res
            .status(200)
            .clearCookie("sessionToken")
            .json({ message: "Logged out" });
    },

    //Simple function to test if the session token is valid.
    TestVerify: async (req, res) => {
        const token = req.cookies.sessionToken;
        if (!token) {
            return res.status(401).json({
                okay: false,
                error: "Bad request",
                message: "Missing session token",
            });
        }
        return auth.Verify(req, res, () => {
            console.log("running from TestVerify", req.user);
            const user = req.user;
            return res.status(200).json({
                okay: true,
                email: user.email,

            });
        });
    },

    //Middle ware to verify session token. Used for all routes other than login and signup.
    Verify: async (req, res, next) => {
        //get session token from cookie (UUID).
        console.log(req.cookies);
        const sessionToken = req.cookies.sessionToken;
        console.log("Received session token: ", sessionToken);
        if (!sessionToken) {
            console.log("Session token not found");
            return res
                .status(404)
                .json({ error: "Could not find sessionToken" }); //Redirect to login page
        }

        var user = null;
        try {
            //Get profile_id from session token (UUID).

            const userString = await auth.sessionDB.get(sessionToken);
            console.log("userString: ", userString);

            if (!userString) {
                console.log("Profile ID not found");
                return res.status(404).json({
                    //Redirect to login page
                    okay: false,
                    error: "Profile_id not found",
                    message: "The server could not find profile id",
                });
            }
            console.log("user: ", userString);
            const userJSON = JSON.parse(userString);
            user = userJSON;
        } catch (error) {
            debugError(error);
            res.status(500).json({
                okay: false,
                error: "Unhandled exception",
                message: "The server encountered an unexpected condition",
            });
        }

        //reset the expire time of the session token
        await auth.sessionDB.expire(
            sessionToken,
            Number(process.env.TOKEN_EXP)
        );

        //Add the profile_id to the request object to be used in the route.

        req.user = user;

        next();
    },
};

export default auth;

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();

import { Redis } from "ioredis";
import { Users } from "../Model/model.user.js";

// First, check if we have a cookie credential

const auth = {
    sessionDB: new Redis(process.env.REDIS_URL),

    SendToken: async (res, user) => {
        const sessionToken = crypto.randomBytes(32).toString("hex");

        try {
            await auth.sessionDB.set(
                sessionToken,
                user.profile_id,
                "EX",
                Number(process.env.TOKEN_EXP)
            );
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        res.cookie("sessionToken", sessionToken, {
            maxAge: Number(process.env.TOKEN_EXP) * 1000 * 1000,
            httpOnly: true,
        });

        return res.status(200).json({
            user: {
                user_id: user.user_id,
                email: user.email,
                password: user.password,
                session_token: sessionToken,
            },
        });
    },

    Signup: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Missing email or password" });

        const userExists = await (async () => {
            try {
                console.log("BP 1");
                const user = await Users.findOne({
                    where: { email },
                });
                console.log("BP 2");
                console.log(!user);
                return user ? true : false;
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Internal server error" });
                return null;
            }
        })();
        console.log("BP 3");
        if (userExists)
            return res.status(409).json({ error: "Email already exists" });

        const hash = await bcrypt.hash(password, 10);
        const user_id = uuidv4();

        console.log("BP 4");

        try {
            const user = await Users.create({
                user_id,
                email,
                hash,
            });
            console.log(user);
        } catch (error) {
            console.log("Failed to send to database");
            res.status(500).json({ error: "Internal server error" });
            return null;
        }

        // await pool.query(
        //   `INSERT INTO "Users" (email, hash, user_id) VALUES ('${email}', '${hash}', '${user_id}')`,
        // );

        auth.SendToken(res, {
            user_id,
            email,
            password,
        });
    },

    Login: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Missing email or password" });

        const user = await (async () => {
            try {
                const user = await Users.findOne({
                    where: { email },
                });
                if (!user) return null;

                return user;
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
                return null;
            }
        })();

        // Check if db actually returns a response or was found
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });

        const hashedPassword = user.hash;

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        //Generate session token
        auth.SendToken(res, {
            profile_id: user.user_id,
            email,
            password,
        });
    },
    //Simple Verify function. checks to make sure a session token is valid
    //TODO: refactor to allow padding of session token directly so it can be used in other functions.

    Logout: async (req, res) => {
        const token = req.cookies.sessionToken;
        if (!token) {
            return res.status(400).json({ error: "Missing session token" });
        }
        try {
            await auth.sessionDB.del(token);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        res.clearCookie("sessionToken");
        return res.status(200).json({ message: "Logged out" });
    },

    TestVerify: async (req, res) => {
        const token = req.cookies.sessionToken;
        if (!token) {
            return res.status(400).json({ error: "Missing session token" });
        }
        auth.Verify(req, res, () => { });
    },

    //Middle ware to verify session token. Used for all routes other than login and signup.
    Verify: async (req, res, next) => {
        //get session token from cookie (UUID).
        const sessionToken = req.cookies.sessionToken;
        if (!sessionToken) {
            return res.status(400).json({ error: "No session token" });
        }

        try {
            //Get profile_id from session token (UUID).
            const user_id = await auth.sessionDB.get(sessionToken);
            if (!user_id) {
                return res.status(401).json({ error: "Invalid session token" });
            }
            return res.status(200).json({ message: "Session token is valid" });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }

        next();
    },
};

export default auth;

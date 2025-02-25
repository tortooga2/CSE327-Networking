import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();

import { Redis } from "ioredis";

import { pool } from "./module.db.js";

// First, check if we have a cookie credential

const auth = {
  sessionDB: new Redis(process.env.REDIS_URL),

  SendToken: async (res, user) => {
    const sessionToken = crypto.randomBytes(32).toString("hex");

    await auth.sessionDB.set(
      sessionToken,
      user.profile_id,
      "EX",
      Number(process.env.TOKEN_EXP),
    );
    res.cookie("sessionToken", sessionToken, {
      maxAge: Number(process.env.TOKEN_EXP) * 1000,
      httpOnly: true,
    });

    return res.status(200).json({
      user: {
        profile_id: user.profile_id,
        email: user.email,
        password: user.password,
        session_token: sessionToken,
      },
    });
  },

  Signup: async (req, res) => {
    const { email, password } = req.body;
    const userExists = await (async () => {
      try {
        const query = `SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`;
        const result = await pool.query(query, [email]);
        return result.rows[0].exists;
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return null;
      }
    })();

    if (userExists)
      return res.status(409).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const profile_id = uuidv4();
    await pool.query(
      `INSERT INTO users (email, hash, profile_id) VALUES ('${email}', '${hash}', '${profile_id}')`,
    );

    auth.SendToken(res, {
      profile_id,
      email,
      password,
    });
  },

  Login: async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email=$1`;
    const user = await (async () => {
      try {
        const { rows } = await pool.query(query, [email]);
        return rows[0] ?? null;
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        return null;
      }
    })();

    // Check if db actually returns a response or was found
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const hashedPassword = user.hash;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    //Generate session token
    auth.SendToken(res, {
      profile_id: user.profile_id,
      email,
      password,
    });
  },
  //Simple Verify function. checks to make sure a session token is valid
  //TODO: refactor to allow padding of session token directly so it can be used in other functions.

  TestVerify: async (req, res) => {
    const token = req.cookies.sessionToken;
    try {
      auth.Verify(token);
    } catch (error) {
      return res.status(401).json({ error: "Invalid session token" });
    }
    return res.status(200).json({ message: "Session token is valid" });
  },

  Verify: async (token) => {
    //get session token from cookie (UUID).
    const sessionToken = token;

    try {
      //Get profile_id from session token (UUID).
      const profile_id = await auth.sessionDB.get(sessionToken);
      if (!profile_id) {
        throw new Error("Invalid session token");
      }
    } catch (error) {
      throw new Error(
        "An error occurred trying to verify the session token. Likely from the redis db, check the redis connection",
      );
    }
  },
};

export default auth;

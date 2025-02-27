import dotenv from "dotenv";

import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

export const pool = new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

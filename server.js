import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import http from "http";

//Import the router from the module
import { sequelize, SyncDB } from "./Modules/Database/module.db.js";
import authRouter from "./Routes/routes.auth.js";
import fileDataRouter from "./Routes/routes.fileData.js";
import s3Router from "./Routes/routes.s3.js";

import { DEBUG } from "./Modules/module.debugHelpers.js";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Create an express application
const app = express();
const PORT = 3000;

async function startServer() {
    // Define frontend paths consistently
    const FRONTEND_ROOT = path.resolve(__dirname, "./FrontEnd");
    const FRONTEND_DIST = path.resolve(__dirname, "./FrontEnd/dist");

    console.log("Frontend root path:", FRONTEND_ROOT);
    console.log("Frontend dist path:", FRONTEND_DIST);

    let vite;
    if (DEBUG) {
        // Create Vite server only in debug mode
        vite = await createViteServer({
            server: {
                middlewareMode: true,
            },
            root: FRONTEND_ROOT,
            appType: "spa",
        });
    }

    //Connect to the database with Sequelize ORM
    console.log(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD
    );
    SyncDB();

    // Add middleware to parse JSON
    app.use(cookieParser());
    app.use(express.json());

    if (DEBUG) {
        app.use(
            cors({
                origin: ["http://localhost:3000", "http://localhost:5173"],
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE"],
                allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
            })
        );
        console.log("CORS enabled");
    }

    //_____________________________________________________________________________________
    // Add Endpoints Here:
    app.use("/api/auth", authRouter);
    app.use("/api/file", fileDataRouter);
    app.use("/api/bin", s3Router);
    //_____________________________________________________________________________________

    if (DEBUG) {
        // Use Vite's connect instance as middleware
        app.use(vite.middlewares);
    } else {
        // Log check to verify the directory exists
        try {
            const fs = await import("fs");
            if (fs.existsSync(FRONTEND_DIST)) {
                console.log("Frontend dist directory exists");

                // Check if index.html exists
                const indexPath = path.join(FRONTEND_DIST, "index.html");
                if (fs.existsSync(indexPath)) {
                    console.log("index.html exists at:", indexPath);
                } else {
                    console.error("index.html NOT FOUND at:", indexPath);
                }
            } else {
                console.error(
                    "Frontend dist directory NOT FOUND at:",
                    FRONTEND_DIST
                );
                console.error(
                    "Did you run the build command in your frontend directory?"
                );
            }
        } catch (error) {
            console.error("Error checking directories:", error);
        }

        // Serve static files from the dist directory
        app.use(express.static(FRONTEND_DIST));

        // Fallback to index.html for client-side routing
        app.get("*", (req, res) => {
            return res.sendFile(path.join(FRONTEND_DIST, "index.html"));
        });
    }

    // Create HTTP server
    const server = http.createServer(app);

    // Start the server
    server.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT} (DEBUG: ${DEBUG})`
        );
    });

    return { server, vite };
}

startServer().catch((err) => {
    console.error("Failed to start server:", err);
});

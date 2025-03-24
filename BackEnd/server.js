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
import schemaRouter from "./Routes/routes.schema.js";

import { DEBUG } from "./Modules/module.debugHelpers.js";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Create an express application
const app = express();
const PORT = 3000;

async function startServer() {
    // Create Vite server
    const vite = await createViteServer({
        server: {
            middlewareMode: true,
        },
        root: path.resolve(__dirname, "../FrontEnd/Networking-Solution"),
        // Make sure HMR websocket connection doesn't get intercepted by API routes
        appType: "spa", // Explicitly tell Vite this is a single page app
    });

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
                origin: ["http://localhost:3000", "http://localhost:5173"], // Both ports allowed
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
    app.use("/api", schemaRouter);

    //_____________________________________________________________________________________

    if (DEBUG) {
        // Use Vite's connect instance as middleware
        app.use(vite.middlewares);
    } else {
        app.use(
            express.static(
                path.join(__dirname, "../FrontEnd/Networking-Solution/dist")
            )
        );
        app.get("*", (req, res) => {
            return res.sendFile(
                path.join(
                    __dirname,
                    "../FrontEnd/Networking-Solution/dist",
                    "index.html"
                )
            );
        });
    }

    // Create HTTP server
    const server = http.createServer(app);

    // Start the server
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    return { server, vite };
}

startServer();

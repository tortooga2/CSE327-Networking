import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//Import the router from the module
import { sequelize, SyncDB } from "./Modules/Database/module.db.js";
import authRouter from "./Routes/routes.auth.js";
import fileDataRouter from "./Routes/routes.fileData.js";
import schemaRouter from "./Routes/routes.schema.js";

import { DEBUG } from "./Modules/module.debugHelpers.js";

dotenv.config();
//Create an express application
const app = express();
const PORT = 3000;
// Define the directory for the server
const __dirname = path.resolve();

//Connect to the database with Sequelize ORM

console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD);

SyncDB();

// Add middleware to parse JSON
app.use(cookieParser());
app.use(express.json());

if (DEBUG) {
    console.log("CORS enabled");
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        })
    ); //Will remove once we deploy
}

//_____________________________________________________________________________________
// Add Enpoints Here:
//Example:
app.use("/api/auth", authRouter);
app.use("/api/file", fileDataRouter);
app.use("/api", schemaRouter);

//_____________________________________________________________________________________

//Try not to change the following code:
//Serve static files from the React app. Make sure you build the front end before running the server
// 'npm run build' in the FrontEnd/Networking-Solution directory
app.use(
    express.static(path.join(__dirname, "../FrontEnd/Networking-Solution/dist"))
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

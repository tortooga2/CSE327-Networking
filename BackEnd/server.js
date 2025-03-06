import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";

//Import the router from the module
import exampleRouter from "./Modules/module.example.js";
import authRouter from "./Routes/routes.auth.js";
import { sequelize } from "./Modules/module.db.js";

dotenv.config();
//Create an express application
const app = express();
const PORT = 3000;
// Define the directory for the server
const __dirname = path.resolve();

//Connect to the database with Sequelize ORM

console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD);

//Test connection
try {
  await sequelize.authenticate();
  console.log("Database connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

//Model sync IMPORTANT: Sync is only for development, and should not be used in production
//Incorrect use of Sync can lead to DATA LOSS
await sequelize.sync({ force: false });

// Add middleware to parse JSON
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  console.log("CORS enabled");
  app.use(cors()); //Will remove once we deploy
}

//_____________________________________________________________________________________
// Add Enpoints Here:
//Example:
app.use("/api/auth", authRouter);

//_____________________________________________________________________________________

//Try not to change the following code:
//Serve static files from the React app. Make sure you build the front end before running the server
// 'npm run build' in the FrontEnd/Networking-Solution directory
app.use(
  express.static(path.join(__dirname, "../FrontEnd/Networking-Solution/dist")),
);

app.get("*", (req, res) => {
  return res.sendFile(
    path.join(__dirname, "../FrontEnd/Networking-Solution/dist", "index.html"),
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

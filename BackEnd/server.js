import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//Import the router from the module
import exampleRouter from "./Modules/module.example.js";
import authRouter from "./Routes/routes.auth.js";

//Create an express application
const app = express();
const PORT = 3000;
// Define the directory for the server
const __dirname = path.resolve();

//Connect to the database with Sequelize ORM
import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize('connectwork', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres'
});

//Test connection
try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//Defining Models for database
//Table that contains user_id as primary key, email, hash, and timestamp
const Users = sequelize.define(
    'Users', {
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: sequelize.uuidV4,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
    },
);

//Model sync IMPORTANT: Sync is only for development, and should not be used in production
//Incorrect use of Sync can lead to DATA LOSS
await sequelize.sync({ force: true });

// Add middleware to parse JSON
app.use(cookieParser());
app.use(express.json());

dotenv.config();

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

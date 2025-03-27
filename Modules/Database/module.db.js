import dotenv from "dotenv";
import chalk from "chalk";
import { Sequelize } from "sequelize";
import { createUsersTable } from "../../Models/model.users.js";
import { createDataTable } from "../../Models/model.data.js";
import { initAssoc } from "./module.initAssoc.js";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
    }
);

const Users = createUsersTable(sequelize);
const Data = createDataTable(sequelize);

const SyncDB = async () => {
    //Test connection
    try {
        await sequelize.authenticate();
        console.log(
            chalk.bgGreen(
                "Database connection has been established successfully."
            )
        );
    } catch (error) {
        console.error(chalk.bgRed("Unable to connect to the database:", error));
        throw error;
    }

    //Model sync IMPORTANT: Sync is only for development, and should not be used in production
    //Incorrect use of Sync can lead to DATA LOSS
    try {
        await Users.sync({ alter: true });
        console.log(chalk.bgGreen("Database synchronized"));
    } catch (error) {
        console.error(("Error syncing database:", error));
    }
    try {
        await Data.sync({ alter: true });
        console.log(chalk.bgGreen("Database synchronized"));
    } catch (error) {
        console.error(chalk.bgRed("Error syncing database:", error));
    }
};

export { Users, Data, sequelize, SyncDB };

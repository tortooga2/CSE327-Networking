import dotenv from "dotenv";
import chalk from "chalk";
import { Sequelize } from "sequelize";
import { createUsersTable } from "../../Models/model.users.js";
import { createDataTable } from "../../Models/model.data.js";
import { createUserSettings } from "../../Models/model.userSettings.js";
import { initAssoc } from "./module.initAssoc.js";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        ...(process.env.DEBUG !== "true"
            ? {
                  dialectOptions: {
                      ssl: {
                          require: true,
                          rejectUnauthorized: false, // You might want to set this to true in production with proper certs
                      },
                  },
              }
            : {}),
    }
);

const Users = createUsersTable(sequelize);
const Data = createDataTable(sequelize);
const UserSettings = createUserSettings(sequelize);

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

    try {
        await UserSettings.sync({ alter: true });
        console.log(chalk.bgGreen("Database synchronized"));
    } catch (error) {
        console.error(chalk.bgRed("Error syncing database:", error));
    }
};

const enablePG_TGRM = async () => {
    const transaction = await sequelize.transaction();

    try {
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS "pg_trgm"', {
            transaction: transaction,
        });

        await transaction.commit();
        console.log(chalk.bgGreen("Postgres pg_tgrm enabled"));
    } catch (error) {
        await transaction.rollback();
        console.log(chalk.bgRed("enableExtensions encountered an error:", error.message));
    };
};

const createIndexes = async () => {
    const transaction = await sequelize.transaction();

    try {
        await sequelize.query('CREATE INDEX IF NOT EXISTS trgm_file_ledger_gin ON "file_ledger" USING GIN ("name" gin_trgm_ops)', {transaction: transaction});
        await sequelize.query('CREATE INDEX IF NOT EXISTS file_ledger_index ON "file_ledger"("owner_id", "createdAt", "type")',{transaction: transaction});

        await transaction.commit();
        console.log(chalk.bgGreen("Indexes created"));
    } catch (error) {
        await transaction.rollback();
        console.log(chalk.bgRed("createIndexes encountered an error:", error.message));
    };
};

export {
    Users,
    Data,
    UserSettings,
    sequelize,
    SyncDB,
    enablePG_TGRM,
    createIndexes,
};

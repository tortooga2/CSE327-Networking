import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { createUsersTable } from "../Models/model.users.js";
import { createDataTable } from "../Models/model.data.js";
import { initAssoc } from "./module.initAssoc.js";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
);

export const Users = createUsersTable(sequelize);
export const Data = createDataTable(sequelize);

//initAssoc({ Users, Data });

export const SyncDB = async () => {

  //Test connection
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  //Model sync IMPORTANT: Sync is only for development, and should not be used in production
  //Incorrect use of Sync can lead to DATA LOSS
  try {
    await Users.sync({ force: false });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
  try {
    await Data.sync({ force: false });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}






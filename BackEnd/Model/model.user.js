import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../Modules/module.db.js";

export const Users = sequelize.define("Users", {
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
});



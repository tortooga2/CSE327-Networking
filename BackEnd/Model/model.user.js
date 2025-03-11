import { DataTypes } from "sequelize";
import { sequelize } from "../Modules/module.db.js";
import { Data } from "../Model/model.data.js";

export const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  profile_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    defaultValue: sequelize.uuidV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  timestamps: false,
});
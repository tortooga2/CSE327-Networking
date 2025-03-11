import { DataTypes } from "sequelize";



export const createUsersTable = (sequelize) => {
  return sequelize.define("users", {
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
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
    {
      timestamps: false,
    });
}



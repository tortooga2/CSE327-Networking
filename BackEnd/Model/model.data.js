import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../Modules/module.db.js";
import { Users } from "../Model/model.user.js";

//Creates Data table
export const Data = sequelize.define("Data", {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.BIGINT, //Why bigint?
        allowNull: true, //Stefano wanted objects to be able to not have a name
        defaultValue: 'Untitled item',
    },
    type: {
        type: DataTypes.ENUM,
        allowNull: false,
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: '{}',
    },
    visitors: {
        type: DataTypes.BIGINT,
    },
    parents: {
        type: Datatypes.JSONB,
        allowNull: false,
        defaultValue: { item_id: [] },
    },
    children: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: { item_id: [] },
    }
});

//Creates foreign key "owner_id" from User's "user_id"
Data.belongsTo(User, {
    foreignKey: "owner_id",
    targetKey: "user_id",
});

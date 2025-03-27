import { DataTypes } from "sequelize";

//Creates the Data table in the DB
export const createDataTable = (sequelize) => {
    return sequelize.define(
        "data",
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            owner_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    //Makes this a foreign key to the Users table
                    model: "users",
                    key: "profile_id",
                },
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "owner_id must be a valid UUID",
                    },
                },
                onDelete: "CASCADE", //Deletes rows in table when User row is deleted
                onUpdate: "CASCADE", //Updates rows in table when User row is deleted
            },
            creator_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    //Makes this a foreign key to the Users table
                    model: "users",
                    key: "profile_id",
                },
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "creator_id must be a valid UUID",
                    },
                },
                onDelete: "CASCADE", //Deletes rows in table when User row is deleted
                onUpdate: "CASCADE", //Updates rows in table when User row is deleted
            },
            creator_username: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "admin",
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isAlpha: {
                        msg: "File type is not supported or is invalid",
                    },
                },
            },
            metadata: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            parents: {
                type: DataTypes.JSONB,
                allowNull: false,
                defaultValue: { item_id: [] },
            },
            children: {
                type: DataTypes.JSONB,
                allowNull: false,
                defaultValue: { item_id: [] },
            },
        },
        { tableName: "file_ledger" },
        {
            indexes: [
                {
                    unique: false,
                    fields: ["owner_id"],
                },
                {
                    unique: false,
                    fields: ["creator_id"],
                },
            ],
        }
    );
};

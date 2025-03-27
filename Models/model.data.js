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
                onDelete: "CASCADE", //Deletes rows in table when User row is deleted
                onUpdate: "CASCADE", //Updates rows in table when User row is deleted
            },
            creator_username: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Anonymous",
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM,
                values: ["jpg", "png", "pdf"], //Placeholder values
                allowNull: false,
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
                    unique: true,
                    fields: ["owner_id", "creator_id", "name"],
                },
            ],
        }
    );
};

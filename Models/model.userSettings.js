import { DataTypes } from "sequelize";

export const createUserSettings = (sequelize) => {
    return sequelize.define(
        "user_settings",
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            profile_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            dark_mode: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            bundle_color: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "#b4637a",
            },
            doc_color: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "#ea9d34",
            },
            note_color: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "#d7827e",
            },
            rec_color: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "#286983",
            },
            img_color: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "#56949f",
            },
            font_size: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "13px",
            },
            font_family: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "monospace",
            },
        },
        {
            indexes: [
                {
                    fields: ["profile_id"],
                },
            ],
        }
    );
};
import { DataTypes } from "sequelize";

export const createUsersTable = (sequelize) => {
    return sequelize.define(
        "users",
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
                unique: true,
                defaultValue: sequelize.uuidV4,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "Must be a valid UUID"
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Invalid email format"
                    }
                }
            },
            hash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username_base: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username_suffix: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            full_username: {
                type: DataTypes.VIRTUAL,
                get() {
                    const base = this.getDataValue("username_base");
                    const suffix = this.getDataValue("username_suffix");
                    return `${base}${suffix ? suffix : ""}`;
                },
            },
        },
        {
            timestamps: false,
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ["email"],
                },
                {
                    unique: true,
                    fields: ["profile_id"],
                },
                {
                    unique: true,
                    fields: ["username_base", "username_suffix"],
                },
            ],
        }
    );
};

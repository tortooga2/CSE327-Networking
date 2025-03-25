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
        },
        {
            timestamps: false,
        }
    );
};

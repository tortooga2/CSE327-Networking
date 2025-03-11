import { DataTypes } from 'sequelize';
import { sequelize } from "../Modules/module.db.js";
import { Users } from "../Model/model.user.js";

//Creates the Data table in the DB
export const Data = sequelize.define('Data', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    owner: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { //Makes this a foreign key to the Users table
            model: 'Users',
            key: 'profile_id',
        },
        onDelete: 'CASCADE', //Deletes rows in table when User row is deleted
        onUpdate: 'CASCADE', //Updates rows in table when User row is deleted
    },
    name: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM,
        values: ['.jpg', '.png', '.pdf'], //Placeholder values
        allowNull: false,
    },
    dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:DataTypes.NOW,
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    visitors: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    parent: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    children: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
},
{
    timestamps: false,
});
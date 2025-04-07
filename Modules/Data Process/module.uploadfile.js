import { Data, sequelize } from "../Database/module.db.js";
import { Sequelize } from "sequelize";

const createFileInDb = async (req, res) => {
    const { profile_id, username_base } = req.user;
    const transaction = await sequelize.transaction(); //Start a transaction to our database

    try {
        const updatedFileData = req.body.fileDataArray.map((file) => ({
            ...file,
            owner_id: profile_id,
            creator_id: profile_id,
            creator_username: username_base,
        }));

        await Data.bulkCreate(
            updatedFileData, 
            { validate: true }, 
            { transaction: transaction },
        );

        await transaction.commit();
        res.status(201).json({
            okay: true,
            message: "File data stored in ledger",
        });
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        console.log(err);

        if (err instanceof Sequelize.ValidationError) {
            console.log(err.message);
            return res.status(400).json({
                okay: false,
                error: "Invalid input",
                message: err.message,
            });
        }

        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

export { createFileInDb };
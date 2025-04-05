import { Data, Users, sequelize } from "../Database/module.db.js";
import { debugError } from "../module.debugHelpers.js";


//Sends a file to another user by simply cloning the row
export const sendFileToUser = async (req, res) => {
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const otherUser = await Users.findByPk(req.params.other_id);
        if (otherUser === null) {
            //Check if the other user exists
            return res.status(404).json({
                okay: false,
                error: "User not found",
                message: "The user you're looking for may not exist",
            });
        }
        if (otherUser.profile_id === req.profile_id) {
            return res.status(400).json({
                okay: false,
                error: "Incorrect User id",
                message: "You tried to send yourself a file",
            });
        }

        const originalFile = await Data.findByPk(req.params.file_id);
        if (originalFile === null) {
            //Check if the file exists
            return res.status(404).json({
                okay: false,
                error: "File not found",
                message: "The file you want to send may not exist",
            });
        }
        if (originalFile.owner_id != req.profile_id) {
            //Check to see if the owner of the file is the client
            return res.status(403).json({
                okay: false,
                error: "Insufficient Permissions",
                message: "You must be the owner of the file to send it",
            });
        }

        const { id, updatedAt, ...fileData } = originalFile.toJSON(); //Destructure original file
        const sentFile = await Data.create(
            {
                ...fileData,
                owner_id: otherUser.profile_id,
            },
            { transaction: transaction }
        );

        await transaction.commit(); //Commit transaction
        res.status(201).send({
            okay: true,
            sent: sentFile,
        });
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

import { Data, sequelize } from "../Database/module.db.js";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { debugError } from "../module.debugHelpers.js";
import { parse } from "path";

//Delete file by ID
export const deleteFileById = async (req, res) => {
    const { profile_id } = req.user;
    const { file_ids } = req.body;

    if (!Array.isArray(file_ids)) {
        return res.status(400).json({
            okay: false,
            error: "Invalid input",
            message: "file_ids must be an array of file IDs",
        });
    }

    const transaction = await sequelize.transaction(); //Start transaction with database
    try {
        const parsedIds = [];
        for (let id = 0; id < file_ids.length; id++) {
            const parsedId = parseInt(file_ids[id]);
            if (isNaN(parsedId)) {
                return res.status(400).json({
                    okay: false,
                    error: "Bad request",
                    message: "All file ids must be integers"
                });
            }
            parsedIds.push(parsedId);
        }

        //Obtain all file keys
        const fileKeys = (await Data.findAll({
            where: {
                id: parsedIds,
                owner_id: profile_id,
            },
            attributes: ['metadata'],
        })).map(item => ({ Key: `${profile_id}/${item.metadata.key}` })); //AWS expects it each to be sent as [{"Key": "key1"}, ...]

        //Delete from Postgres
        const rowsDeleted = await Data.destroy({
                where: {
                    id: file_ids,
                    owner_id: profile_id,
                },
            }, 
            {transaction: transaction},
        );

        if (rowsDeleted === 0) {
            return res.status(404).json({
                okay: false,
                error: "File(s) not found",
                message: "The file(s) you are trying to delete may not exist",
            });
        }

        // Delete the file from our bucket
        const command = new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
                Objects: fileKeys,
            },
        });
        await s3Client.send(command);
        
        await transaction.commit(); //Commit transaction
        res.status(200).json({ okay: true, message: "Files successfully deleted"}); 
    } catch (err) {
        await transaction.rollback(); //Rollback transaction because of error
        debugError(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    };
};

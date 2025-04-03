import { Data, sequelize } from "../Database/module.db.js";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { debugError } from "../module.debugHelpers.js";

//Delete file by ID
export const deleteFileById = async (req, res) => {
    const { profile_id } = req.user;
    const transaction = await sequelize.transaction(); //Start transaction with database
    
    try {
        const file = await Data.findByPk(req.params.id); //Obtain file info from database

        if (!file) {
            return res.status(404).json({
                okay: false,
                error: "File not found",
                message: "The file you are looking for may not exist",
            });
        }

        if (file.owner_id != profile_id) {
            return res.status(403).json({
                okay: false,
                error: "Insufficient credentials",
                message: "This file does not belong to you",
            });
        }

        // Delete the file from our bucket
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: `${file.owner_id}/${file.metadata.key}`,
        });
        await s3Client.send(command);

        //Delete from Postgres
        await file.destroy({ transaction: transaction }); 
        
        await transaction.commit(); //Commit transaction
        res.status(200).json({ okay: true, message: "File deleted"}); 
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

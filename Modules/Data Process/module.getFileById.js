import { Data, Users, sequelize } from "../Database/module.db.js";
import { debugMessage, debugError } from "../module.debugHelpers.js";
import { Sequelize } from "sequelize";
import crypto from "crypto";

//S3 stuff
import {
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";

//Should send the file back to the client when given proper file ID
export const getFileById = async (req, res) => {
    const { profile_id } = req.user;
    try {
        const file = await Data.findByPk(req.params.fileId);

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

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: file.metadata.key,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 10 }); //Url is currently set to expire in 10 seconds

        res.status(200).json({
            okay: true,
            file: file,
            url: url,
        });
    } catch (err) {
        debugError(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

import { Data, Users, sequelize } from "../Database/module.db.js";
import { debugMessage, debugError } from "../module.debugHelpers.js";
import { Sequelize } from "sequelize";
import crypto from "crypto";

import {
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";

export const getAllUserData = async (req, res) => {
    console.log("Get all user data");
    const { profile_id } = req.user;
    try {
        const data = await Data.findAll({
            attributes: [
                "id",
                "creator_username",
                "name",
                "type",
                "metadata",
                "parents",
                "children",
                "createdAt",
                "updatedAt",
                "location"
            ],
            where: {
                owner_id: profile_id,
            },
        });

        //Getting the IDs of all items grabbed
        const keys = data.map((item) => item.metadata.key);

        const fileUrls = await Promise.all(
            keys.map(async (key) => {
                const command = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                });

                return getSignedUrl(s3Client, command, { expiresIn: 10 });
            })
        );

        debugMessage(data);
        res.status(200).json({
            okay: true,
            data: data,
            urls: fileUrls,
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

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { s3Client, bucketName } from "./module.s3client.js";

export const generateUploadUrl = async (req, res) => {
    console.log("Generating upload URL");
    const { profile_id } = req.user;
    const { fileCount }  = req.body;
    const uploadUrls = [];
    const fileKeys = [];

    if (fileCount === 0) {
        return res.status(400).json({
            okay: false,
            error: "Bad request",
            message: "Expected file count to be greater than 0",
        });
    }

    try {
        for (let i = 0; i < fileCount; i++) {
            fileKeys.push(crypto.randomBytes(16).toString("hex"));
        }

        for (let i = 0; i < fileCount; i++) {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: `${profile_id}/${fileKeys[i]}`,
            });

            uploadUrls.push(await getSignedUrl(s3Client, command, {expiresIn: (60 * fileCount)}));
        }

        res.status(200).json({
            okay: true,
            urls: uploadUrls,
            keys: fileKeys,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import {
    PutObjectCommand,
    ListObjectsCommand,
    CopyObjectCommand,
    GetObjectCommand,
    DeleteObjectsCommand,
    DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js"

const fileupload = async (req, res) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    req.file.buffer

    // const params = {
    //     Bucket: bucketName,
    //     Key: req.file.originalname,
    //     Body: req.file.buffer,
    //     ContentType: req.file.mimetype,
    // };

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    });

    await s3Client.send(command);


    res.status(200).send("yuh");
};

export { fileupload };

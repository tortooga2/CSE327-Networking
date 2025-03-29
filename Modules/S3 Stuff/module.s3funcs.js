import {
    PutObjectCommand,
    ListObjectsCommand,
    CopyObjectCommand,
    GetObjectCommand,
    DeleteObjectsCommand,
    DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";
import crypto from "crypto";

//Generates a random name for files. In S3, if a file is uploaded to a bucket and it shares a name with some other file in the bucket, it overrides the old one
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const fileupload = async (req, res) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    req.file.buffer;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: randomImageName(),
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    });

    await s3Client.send(command);


    res.status(200).send("yuh");
};

export { fileupload };

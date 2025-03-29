import {
    PutObjectCommand,
    ListObjectsCommand,
    CopyObjectCommand,
    GetObjectCommand,
    DeleteObjectsCommand,
    DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";

import crypto from "crypto";
import { Data } from "../Database/module.db.js";

const fileUpload = async (req, res) => {
    const { profile_id, username_base } = req.user;
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    req.file.buffer;
    const newFileName = crypto.randomBytes(32).toString('hex'); //Generates a random name for files. In S3, if a file is uploaded to a bucket and it shares a name with some other file in the bucket, it overrides the old one

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    });

    await s3Client.send(command);
    
    const sentFile = await Data.create({
        owner_id: profile_id,
        creator_id: profile_id,
        creator_username: username_base,
        name: req.file.originalname,
        type: req.file.mimetype.split("/")[1],
        metadata: {
            key: newFileName,
        },
    });

    res.status(201).json(sentFile);
};

const fileDownload = async (req, res) => {
    //Obtain the file's key from the database
    const { metadata } = await Data.findByPk(req.params.id);

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: metadata.key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 }); //Url is currently set to expire in 60 seconds
    res.status(200).send(url);
};

export { fileUpload, fileDownload };

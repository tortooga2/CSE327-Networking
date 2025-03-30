import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME
const bucketRegion = process.env.AWS_REGION

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: bucketRegion,
    logger: console,
});

export { s3Client, bucketName, bucketRegion };
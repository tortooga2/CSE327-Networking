import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const bucketRegion = process.env.S3_REGION;

const s3Client = (() => {
    try {
        return new S3Client({
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
            region: bucketRegion,
        });
    } catch (error) {
        console.error("Error creating S3 client:", error);
        throw error; // Rethrow the error to be handled by the calling code
    }
})();

export { s3Client, bucketName, bucketRegion };

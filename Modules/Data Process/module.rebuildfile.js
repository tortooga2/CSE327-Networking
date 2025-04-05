import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";

export const getDataUrl = async (file) => {
    const { creator_id } = file;
    const { key } = file.metadata;

    console.log("Getting data at URL", `${creator_id}/${key}`);

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: `${creator_id}/${key}`,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 1000 }); //Url is currently set to expire in 10 seconds
    return url;
};

export const rebuildFile = async (file) => {
    file.metadata.url = await getDataUrl(file);
    return file;
};

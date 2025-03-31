import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generateUploadUrl = async (req, res) => {
    const { profile_id } = req.user;
    const { fileName } = req.body; // Extract the file name from the request body
    if (!fileName) {
        return res.status(400).json({
            okay: false,
            error: "Bad Request",
            message: "File name is required",
        });
    }
    const fileKey = crypto.randomUUID() + fileName; // Generate a unique file key using UUID and append the original file name

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${profile_id}/${fileKey}`,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    res.status(200).send(url);
};

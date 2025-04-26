import { genPresignedUrl } from "../S3 Stuff/module.genPresignedUrl.js";
import crypto from "crypto";

const uploadHelper = async (req, res) => {
    const { profile_id } = req.user;
    const { fileCount } = req.body;
    const urls = []; //Will store our urls that we return to the client
    const keys = []; //Will store instances of our model

    //Input validation
    // if(!Number.isInteger(fileCount)) {
    //     throw new TypeError("Expected fileCount to be an integer");
    // }
    
    // if (fileCount < 1) {
    //     throw new TypeError("fileCount must be 1 or greater");
    // }

    // if (!Array.isArray(fileNames)) {
    //     throw new TypeError("Expected fileNames and fileTypes to be sent as arrays");
    // }

    try {
        for (let i = 0; i < fileCount; i++) {
            const key = crypto.randomBytes(16).toString("hex");

            urls.push(await genPresignedUrl(profile_id, key, "PUT"));

            keys.push(key);
        }
        
        return res.status(200).json({
            okay: true,
            urls: urls,
            keys: keys           
        });
    } catch (err) {
        return res.status(500).json({
            okay: false,
            error: "Internal server error",
            message: "The server encountered an unexpected condition",
        });
    };
};

export { uploadHelper };
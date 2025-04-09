import { Data } from "../Database/module.db.js";
import { genPresignedUrl } from "../S3 Stuff/module.genPresignedUrl.js";
import crypto from "crypto";
import mime from "mime";

//This function takes advantage of models being classes to create instances without saving (fucking awesome)
const genDataInstance = async (profile_id, key, fileName, fileType, username) => {
    //Validate inputs (This looks so ugly idk how to make this readable)
    if (
        typeof key !== "string" 
        || typeof fileName !== "string" 
        || typeof fileType !== "string"
        || typeof profile_id !== "string"
    ) {
        throw new TypeError("Arguments must all be strings!");
    }

    try {
        return Data.build({
            owner_id: profile_id,
            creator_id: profile_id,
            creator_username: username,
            name: fileName,
            type: fileType,
            metadata: {
                key: key,
            },
        });
    } catch (err) {
        console.log("Couldn't generate instance of Data model: ", err);
        throw new Error("Couldn't generate instance of Data model: ");
    };
};

const uploadHelper = async (req, res) => {
    const {profile_id, username_base } = req.user;
    const { fileCount, fileNames, fileTypes } = req.body;
    const urls = []; //Will store our urls that we return to the client
    const data = []; //Will store instances of our model

    //Input validation
    if(!Number.isInteger(fileCount)) {
        throw new TypeError("Expected fileCount to be an integer");
    }
    
    if (fileCount < 1) {
        throw new TypeError("fileCount must be 1 or greater");
    } 

    if (typeof fileName !== "string" || typeof fileType !== "string") {
        throw new TypeError("fileName and fileType must be strings!");
    }

    if (!Array.isArray(fileNames) || !Array.isArray(fileTypes)) {
        throw new TypeError("Expected fileNames and fileTypes to be sent as arrays");
    }

    try {
        for (let i = 0; i < fileCount; i++) {
            const key = crypto.randomBytes(16).toString("hex");
            urls.push(await genPresignedUrl(profile_id, key, "PUT"));
            data.push(await genDataInstance(profile_id, key, fileNames[i], mime.getExtension(fileTypes[i]), username_base));
        }
        
        res.status(200).json({
            okay: true,
            urls: urls,
            data: data,            
        });
    } catch (err) {
        res.status(500).json({
            okay: false,
            error: err,
            message: "The server encountered an unexpected condition",
        });
    };
};

export { uploadHelper };
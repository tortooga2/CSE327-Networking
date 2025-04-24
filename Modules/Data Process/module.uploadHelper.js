import { genPresignedUrl } from "../S3 Stuff/module.genPresignedUrl.js";
import crypto from "crypto";

//This function takes advantage of models being classes to create instances without saving
const genDataInstance = async (key, fileName) => {
    if (typeof key !== "string" || typeof fileName !== "string") {
        throw new TypeError("Arguments must all be strings!");
    }

    try {
        return { 
            name: fileName, 
            key: key,
        };
    } catch (err) {
        console.log("Couldn't generate instance of Data model: ", err);
        throw new Error("Couldn't generate instance of Data model: ");
    };
};

const uploadHelper = async (req, res) => {
    const {profile_id } = req.user;
    const { fileCount, fileNames } = req.body;
    const urls = []; //Will store our urls that we return to the client
    const data = []; //Will store instances of our model

    //Input validation
    if(!Number.isInteger(fileCount)) {
        throw new TypeError("Expected fileCount to be an integer");
    }
    
    if (fileCount < 1) {
        throw new TypeError("fileCount must be 1 or greater");
    }

    if (!Array.isArray(fileNames)) {
        throw new TypeError("Expected fileNames and fileTypes to be sent as arrays");
    }

    try {
        for (let i = 0; i < fileCount; i++) {
            const key = crypto.randomBytes(16).toString("hex");

            urls.push(await genPresignedUrl(profile_id, key, "PUT"));

            //Extracting the file type from the name of the file
            // const fileExtension = fileNames[i].split('.').pop();

            data.push(await genDataInstance(key, fileNames[i]));
        }
        
        return res.status(200).json({
            okay: true,
            urls: urls,
            data: data,            
        });
    } catch (err) {
        return res.status(500).json({
            okay: false,
            error: err,
            message: "The server encountered an unexpected condition",
        });
    };
};

export { uploadHelper };
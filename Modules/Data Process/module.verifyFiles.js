import { Data, sequelize } from "../Database/module.db.js";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

const checkObjExistence = async (profile_id, key) => {
    if (typeof profile_id !== "string" || typeof key !== "string") {
        throw new TypeError("profile_id and key must be strings!");
    }

    const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: `${profile_id}/${key}`,
    });

    try {
        await s3Client.send(command);
        return true; //No errors thrown, so the object exists
    } catch (err) {
        if (
            err.$metadata.httpStatusCode === 404 ||
            err.$metadata.httpStatusCode === 403
        ) {
            return false; //File doesn't exist if Amazon throws this error
        }

        console.log("Couldn't check objects existence: ", err);
        throw new Error("Couldn't check objects existence");
    }
};

const verifyFiles = async (req, res) => {
    const { profile_id } = req.user;
    const { data } = req.body;
    const sentFiles = []; //All existing files will be copied to this array for bulk creation

    //Validate inputs
    if (!Array.isArray(data)) {
        throw new TypeError("Expected data to be an array");
    }

    try {
        const keys = data.map((file) => file.metadata.key); //Extract keys from the data

        //Check if each file exists in bucket
        for (let i = 0; i < data.length; i++) {
            if (await checkObjExistence(profile_id, keys[i])) {
                sentFiles.push(data[i]); //Push the existing files into another array
            }
        }

        if (sentFiles.length === 0) {
            //This fucking line wasted so much of my life
            return res.status(404).json({
                okay: false,
                error: "Files not found",
                message: "Files were not uploaded to the bucket",
            });
        }

        const transaction = await sequelize.transaction(); //Start transaction with database
        const freshlyMadeNewlyBakedFiles = await Data.bulkCreate(
            //Bulk create validated files into our database
            sentFiles,
            { transaction: transaction, returning: true }
        );

        await transaction.commit();

        //Check to see if all files were validated
        if (data.length === sentFiles.length) {
            return res.status(201).json({
                okay: true,
                message: "All files were successfully uploaded!",
                data: freshlyMadeNewlyBakedFiles,
            });
        } else {
            return res.status(201).json({
                okay: true,
                message: "Some files did not upload successfully",
            });
        }
    } catch (err) {
        return res.status(500).json({
            okay: false,
            error: err,
            message: "The server encountered an unexpected condition",
        });
    }
};

export { verifyFiles };

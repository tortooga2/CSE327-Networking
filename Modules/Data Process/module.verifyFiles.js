import { Data, sequelize } from "../Database/module.db.js";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

const checkObjExistence = async (profile_id, key) => {
    if (typeof key !== "string") {
        throw new TypeError("All values within keys must be strings");
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
    const { profile_id, username_base } = req.user
    const { keys, fileNames } = req.body;
    const transaction = await sequelize.transaction(); //Start transaction with database
    const sentFiles = []; //All existing files will be copied to this array for bulk creation

    if (!Array.isArray(keys) || !Array.isArray(fileNames)) {
        return res.status(400).json({
            okay: false,
            error: "Bad request",
            message: "keys and fileNames must be arrays!",
        });
    }

    try {
        //Check if each file exists in bucket
        for (let index = 0; index < keys.length; index++) {
            if (await checkObjExistence(profile_id, keys[index])) {
                if (typeof (fileNames[index]) !== "string") {
                    return res.status(400).json({
                        okay: false,
                        error: "Bad request",
                        message: "All values within fileNames must be strings!",
                    });
                }

                sentFiles.push({
                    owner_id: profile_id,
                    creator_id: profile_id,
                    creator_username: username_base,
                    name: fileNames[index],
                    type: (fileNames[index]).split('.').pop(),
                    metadata: {
                        key: keys[index]
                    }
                });
            }
        }

        if (sentFiles.length === 0) {
            return res.status(404).json({
                okay: false,
                error: "Files not found",
                message: "Files were not uploaded to the bucket",
            });
        }

        const freshlyMadeNewlyBakedFiles = await Data.bulkCreate(
            //Bulk create validated files into our database
            sentFiles,
            { transaction: transaction, returning: true }
        );

        await transaction.commit();

        if (keys.length === sentFiles.length) {
            return res.status(201).json({
                okay: true,
                message: "All files were successfully uploaded!",
                data: freshlyMadeNewlyBakedFiles,
            });
        }
        
        return res.status(201).json({
            okay: true,
            message: "Some files did not upload successfully",
            data: freshlyMadeNewlyBakedFiles,
        });
    } catch (err) {
        await transaction.rollback();

        if (err instanceof TypeError) {
            return res.status(400).json({
                okay: false,
                error: "Bad request",
                message: err.message,
            });
        }

        console.log(err)
        return res.status(500).json({
            okay: false,
            error: "Internal server error",
            message: "The server encountered an unexpected condition",
        });
    }
};

export { verifyFiles };

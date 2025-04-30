import { Data, Users, sequelize } from "../Database/module.db.js";
import { debugMessage, debugError } from "../module.debugHelpers.js";
import { Sequelize } from "sequelize";
import crypto from "crypto";

//S3 stuff
import {
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";

export const ConnectFiles = async (req, res) => {
    //Connect files together
    //1. Create a new object of type bundle
    //2. Add the files to the bundles children
    //3. Add the bundle to the files parents
    const { profile_id, email } = req.user;
    const { file_ids } = req.body;

    if (!Array.isArray(file_ids)) {
        return res.status(400).json({
            okay: false,
            error: "Invalid input",
            message: "file_ids must be an array of file IDs",
        });
    }

    const transaction = await sequelize.transaction(); //Start transaction with database
    try {
        const bundle = await Data.create(
            {
                name: "Bundle",
                type: "bundle",
                metadata: {
                    key: "value",
                },
                parents: {
                    item_id: [],
                },
                children: {
                    item_id: [...file_ids],
                },
                owner_id: profile_id,
                creator_id: profile_id,
                creator_username: email,
            },
            { transaction: transaction }
        );
        await transaction.commit(); //Commit transaction
        console.log(`Created bundle ${bundle.id}`);

        const files = [];

        for (const fileId of file_ids) {
            try {
                // Find the file record by primary key

                const fileData = await Data.findByPk(fileId);

                if (!fileData) {
                    console.log(`File with ID ${fileId} not found`);
                    continue;
                }

                // Since parents is JSONB and already initialized with { item_id: [] },
                // we can directly modify it
                if (!fileData.parents.item_id.includes(bundle.id)) {
                    // Create a new array with the bundle ID added
                    const updatedItemIds = [
                        ...fileData.parents.item_id,
                        bundle.id,
                    ];

                    // Update the parents field
                    try {
                        fileData.parents = {
                            ...fileData.parents,
                            item_id: updatedItemIds,
                        };
                    } catch (error) {
                        console.error(`Error updating file ${fileId}:`, error);
                    }

                    // Save the changes
                    try {
                        await fileData.save();
                        files.push(fileData);
                    } catch (err) {
                        console.error(`Error updating file ${fileId}:`, err);
                    }
                    console.log(
                        `Updated file ${fileId} with bundle ${bundle.id}`
                    );
                } else {
                    console.log(
                        `Bundle ${bundle.id} already in file ${fileId}`
                    );
                }
            } catch (error) {
                console.error(`Error updating file ${fileId}:`, error);
            }
        }

        console.log(`Connected files to bundle ${bundle.id}`);
        res.status(200).json({
            okay: true,
            data: [...files, bundle],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

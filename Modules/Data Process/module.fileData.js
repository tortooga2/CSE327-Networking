import { Data, Users, sequelize } from "../Database/module.db.js";
import { debugMessage, debugError } from "../module.debugHelpers.js";
import { Sequelize } from "sequelize";
import crypto from "crypto";

//S3 stuff
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "../S3 Stuff/module.s3client.js";

const getAllUserData = async (req, res) => {
    console.log("Get all user data");
    const { profile_id } = req.user;
    try {
        const data = await Data.findAll({
            attributes: [
                "id",
                "creator_username",
                "name",
                "type",
                "metadata",
                "parents",
                "children",
                "createdAt",
                "updatedAt",
            ],
            where: {
                owner_id: profile_id,
            },
        });

        //Getting the IDs of all items grabbed
        const keys = data.map(item => item.metadata.key);
        
        const fileUrls = await Promise.all(
            keys.map(async (key) => {
                const command = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                });

                return (getSignedUrl(s3Client, command, { expiresIn: 10 }));
            }),
        );

        debugMessage(data);
        res.status(200).json({
            okay: true,
            data: data,
            urls: fileUrls,
        });
    } catch (err) {
        debugError(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

const GenerateData = () => {
    const data = {};
    data.name = "This is just Test";
    data.type = "jpg";
    data.metadata = {
        key: "value",
    };
    data.parents = {
        item_id: [],
    };
    data.children = {
        item_id: [],
    };
    return data;
};

const testCreateUserData = async (req, res) => {
    const { profile_id, username_base } = req.user;
    try {
        const newData = await Data.create({
            ...GenerateData(),
            owner_id: profile_id,
            creator_id: profile_id,
            creator_username: req.user.username_base,
        });
        debugMessage(newData);
        res.status(200).json({
            okay: true,
            data: newData,
        });
    } catch (err) {
        debugError(err);

        if (err instanceof Sequelize.ValidationError) {
            console.log(err.message);
            return res.status(400).json({
                okay: false,
                error: "Invalid input",
                message: err.message,
            });
        }

        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

const createUserData = async (req, res) => {
    console.log("Create user data");
    const { profile_id, username_base } = req.user;
    const { data } = req.body;
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const newData = await Data.create(
            {
                ...data,
                owner_id: profile_id,
                creator_id: profile_id,
                creator_username: req.user.username_base,
            },
            { transaction: transaction }
        );

        await transaction.commit(); //Commit transaction
        debugMessage(newData);
        res.status(200).json({
            okay: true,
            data: newData,
        });
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);

        if (err instanceof Sequelize.ValidationError) {
            console.log(err.message);
            return res.status(400).json({
                okay: false,
                error: "Invalid input",
                message: err.message,
            });
        }

        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

//Delete file by ID
const deleteFileById = async (req, res) => {
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const file = await Data.findByPk(req.params.id);

        if (file === null) {
            return res.status(404).json({
                okay: false,
                error: "File not found",
                message: "File you tried to delete may not exist",
            });
        }

        if (file.owner_id != req.profile_id) {
            return res.status(403).json({
                okay: false,
                error: "Insufficient credentials",
                message: "This file does not belong to you",
            });
        }

        await file.destroy({ transaction: transaction });

        await transaction.commit(); //Commit transaction
        res.status(200).json({
            okay: true,
        });
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

const updateFileLedger = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const file = await Data.findByPk(req.params.id);

        if (file === null) {
            return res.status(404).json({
                okay: false,
                error: "File not found",
                message: "The file you tried to update may not exist",
            });
        }

        if (file.owner_id != req.profile_id) {
            return res.status(403).json({
                okay: false,
                error: "Insufficient credentials",
                message: "This file does not belong to you",
            });
        }

        //Check the columns. We don't want to change id, owner_id, updatedAt, createdAt, or creator_id
        const invalidColumn = [
            "id",
            "owner_id",
            "createdAt",
            "updatedAt",
            "creator_id",
        ];
        for (const key in req.body) {
            for (let i = 0; i < 5; i++) {
                if (key === invalidColumn[i]) {
                    return res.status(400).json({
                        okay: false,
                        error: "Bad Request",
                        message: "Not allowed to change one of the columns",
                    });
                }
            }
        }

        await file.update(req.body, { transaction: transaction });

        await transaction.commit(); //Commit transaction
        res.status(200).json({
            okay: true,
            file: file,
        });
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);

        if (err instanceof Sequelize.ValidationError) {
            console.log(err.message);
            return res.status(400).json({
                okay: false,
                error: "Invalid input",
                message: err.message,
            });
        }

        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

//Should send the file back to the client when given proper file ID
const getFileById = async (req, res) => {
    const { profile_id } = req.user;
    try {
        const file = await Data.findByPk(req.params.id);

        if (!file) {
            return res.status(404).json({
                okay: false,
                error: "File not found",
                message: "The file you are looking for may not exist",
            });
        }

        if (file.owner_id != profile_id) {
            return res.status(403).json({
                okay: false,
                error: "Insufficient credentials",
                message: "This file does not belong to you",
            });
        }

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: file.metadata.key,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 10 }); //Url is currently set to expire in 10 seconds

        res.status(200).json({
            okay: true,
            file: file,
            url: url,
        });
    } catch (err) {
        debugError(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    };
};

//Sends a file to another user by simply cloning the row
const sendFileToUser = async (req, res) => {
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const otherUser = await Users.findByPk(req.params.other_id);
        if (otherUser === null) {
            //Check if the other user exists
            return res.status(404).json({
                okay: false,
                error: "User not found",
                message: "The user you're looking for may not exist",
            });
        }
        if (otherUser.profile_id === req.profile_id) {
            return res.status(400).json({
                okay: false,
                error: "Incorrect User id",
                message: "You tried to send yourself a file",
            });
        }

        const originalFile = await Data.findByPk(req.params.file_id);
        if (originalFile === null) {
            //Check if the file exists
            return res.status(404).json({
                okay: false,
                error: "File not found",
                message: "The file you want to send may not exist",
            });
        }
        if (originalFile.owner_id != req.profile_id) {
            //Check to see if the owner of the file is the client
            return res.status(403).json({
                okay: false,
                error: "Insufficient Permissions",
                message: "You must be the owner of the file to send it",
            });
        }

        const { id, updatedAt, ...fileData } = originalFile.toJSON(); //Destructure original file
        const sentFile = await Data.create(
            {
                ...fileData,
                owner_id: otherUser.profile_id,
            },
            { transaction: transaction }
        );

        await transaction.commit(); //Commit transaction
        res.status(201).send({
            okay: true,
            sent: sentFile,
        });
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

const ConnectFiles = async (req, res) => {
    //Connect files together
    //1. Create a new object of type bundle
    //2. Add the files to the bundles children
    //3. Add the bundle to the files parents
    const { profile_id, username_base } = req.user;
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
                creator_username: username_base,
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

const generateUploadUrl = async (req, res) => {
    const fileKey = crypto.randomBytes(16).toString('hex');
    const { profile_id } = req.user;

    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: `${profile_id}/${fileKey}`,
        });
    
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    
        res.status(200).json({
            okay: true,
            url: url,
            key: fileKey,
        });
    } catch (err) {
        console.log(error);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    };
};

export {
    getAllUserData,
    createUserData,
    testCreateUserData,
    deleteFileById,
    updateFileLedger,
    getFileById,
    sendFileToUser,
    ConnectFiles,
    generateUploadUrl
};

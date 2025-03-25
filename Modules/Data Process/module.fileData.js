import { Data, Users, sequelize } from "../Database/module.db.js";
import { debugMessage, debugError } from "../module.debugHelpers.js";

const getAllUserData = async (req, res) => {
    console.log("Get all user data");
    const profile_id = req.profile_id;
    try {
        const data = await Data.findAll({
            where: {
                owner_id: profile_id,
            },
        });

        debugMessage(data);
        res.status(200).send({ data: data });
    } catch (err) {
        debugError(err);
        res.status(500).send("Internal Server Error");
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
    const profile_id = req.profile_id;
    try {
        const newData = await Data.create({
            ...GenerateData(),
            owner_id: profile_id,
            creator_id: profile_id,
        });
        debugMessage(newData);
        res.status(200).send({ data: newData });
    } catch (err) {
        debugError(err);
        res.status(500).send("Internal Server Error");
    }
};

const createUserData = async (req, res) => {
    const profile_id = req.profile_id;
    const { data } = req.body;
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const newData = await Data.create(
            {
                ...data,
                owner_id: profile_id,
                creator_id: profile_id
            },
            { transaction: transaction }
        );

        await transaction.commit(); //Commit transaction
        debugMessage(newData);
        res.status(200).send({ data: newData });
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).send("Internal Server Error");
    }
};

//Delete file by ID
const deleteFileById = async (req, res) => {
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const file = await Data.findByPk(req.params.id);

        if (file === null) {
            return res.status(404).json({
                error: "File not found",
                message: "File you tried to delete may not exist"
            });
        }

        if (file.owner_id != req.profile_id) {
            return res.status(403).json({
                error: "Insufficient credentials",
                message: "This file does not belong to you"
            });
        }

        await file.destroy({ transaction: transaction });

        await transaction.commit(); //Commit transaction
        res.status(204).send();
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).json({
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition"
        });
    }
};

const updateFileLedger = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const file = await Data.findByPk(req.params.id);
        
        if (file === null) {
            return res.status(404).json({
                error: "File not found",
                message: "The file you tried to update may not exist"
            });
        }

        if (file.owner_id != req.profile_id) {
            return res.status(403).json({
                error: "Insufficient credentials",
                message: "This file does not belong to you"
            });
        }

        //Check the columns. We don't want to change id, owner_id, updatedAt, createdAt, or creator_id
        const invalidColumn = ["id", "owner_id", "createdAt", "updatedAt", "creator_id"];
        for (const key in req.body) {
            for (let i = 0; i < 5; i++) {
                if (key === invalidColumn[i]) {
                    return res.status(400).json({
                        "error": "Bad Request",
                        "message": "Not allowed to change one of the columns"
                    });
                }
            }
        }

        await file.update(req.body, {transaction: transaction});

        await transaction.commit(); //Commit transaction
        res.status(200).send({ file: file});
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).json({
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition"
        });
    }
};

//Should send the file back to the client when given proper file ID
const getFileById = async (req, res) => {
    try {
        const file = await Data.findByPk(req.params.id);

        if (file === null) {
            return res.status(404).json({
                error: "File not found",
                message: "The file you are trying to find may not exist"
            });
        };

        if (file.owner_id != req.profile_id) {
            return res.status(403).json({
                error: "Insufficient credentials",
                message: "This file does not belong to you"
            });
        };
        
        res.status(200).send({ file: file});

    } catch (err) {
        debugError(err);
        res.status(500).json({
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition"
        });
    }
};

//Sends a file to another user by simply cloning the row
const sendFileToUser = async (req, res) => {
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const otherUser = await Users.findByPk(req.params.other_id);
        if (otherUser === null) { //Check if the other user exists
            return res.status(404).json({
                error: "User not found",
                message: "The user you're looking for may not exist"
            }); 
        }
        if (otherUser.profile_id === req.profile_id) {
            return res.status(400).json({
                error: "Incorrect User id",
                message: "You tried to send yourself a file"
            });
        }

        const originalFile = await Data.findByPk(req.params.file_id);
        if (originalFile === null) { //Check if the file exists
            return res.status(404).json({
                error: "File not found",
                message: "The file you want to send may not exist"
            }); 
        }
        if (originalFile.owner_id != req.profile_id) { //Check to see if the owner of the file is the client
            return res.status(403).json({
                error: "Insufficient Permissions",
                message: "You must be the owner of the file to send it",
            });
        }
    
        const { id, createdAt, updatedAt, ...fileData } = originalFile.toJSON(); //Destructure original file
        const sentFile = await Data.create({
            ...fileData,
            owner_id: otherUser.profile_id,
        }, { transaction: transaction });

        await transaction.commit(); //Commit transaction
        res.status(201).send({ sent: sentFile });
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).send("Internal server error");
    }
};

export { getAllUserData, createUserData, testCreateUserData, deleteFileById, updateFileLedger, getFileById, sendFileToUser };
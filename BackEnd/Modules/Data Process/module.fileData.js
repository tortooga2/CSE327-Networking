import { Data, sequelize } from "../Database/module.db.js";
import { debugMessage, debugError } from "../module.debugHelpers.js";

const getAllUserData = async (req, res) => {
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
    const profile_id = req.profile_id;
    const id = req.params.id;
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const deletedFile = await Data.destroy(
            {
                where: {
                    id: id,
                    owner_id: profile_id,
                },
            },
            { transaction: transaction }
        );

        //If deletedFile == 0, no file was deleted
        if (deletedFile == 0) {
            res.status(404).json({
                message: "File not found",
            });
            return; //Chase lemme know if this is bad practice. I put this to stop it from executing more code.
        }

        await transaction.commit(); //Commit transaction
        res.status(204).send();
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

//Should send the file back to the client when given proper file ID
const sendFileById = async (req, res) => {
    try {
        const file = await Data.findAll(
            {
                where: { id: req.params.id },
            },
        );

        if (file[0] == null) {
            res.status(404).send("File not found");
            return;
        };

        if (file[0].owner_id != req.profile_id) {
            res.status(403).send("The client does not have access rights to the content");
            return;
        };
        
        res.status(200).send({ file: file});

    } catch (err) {
        debugError(err);
        res.status(500).send("Internal Server Error");
    }
};

export { getAllUserData, createUserData, testCreateUserData, deleteFileById, sendFileById };

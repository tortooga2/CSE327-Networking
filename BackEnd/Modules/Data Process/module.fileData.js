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
    const transaction = await sequelize.transaction(); //Start transaction with database

    try {
        const file = await Data.findByPk(req.params.id);

        if (file === null) {
            res.status(404).send("File not found");
            return;
        }

        if (file.owner_id != req.profile_id) {
            res.status(403).send("The client does not have access rights to the content");
            return;
        }

        await file.destroy({ transaction: transaction });

        await transaction.commit(); //Commit transaction
        res.status(204).send();
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).send("Internal server error");
    }
};

const updateFileLedger = async (req, res) => {
    const transaction = await sequelize.transaction();
    const changes = req.body;

    try {
        const file = await Data.findByPk(req.params.id);
        
        if (file === null) {
            res.status(404).send("File not found");
            return;
        }

        if (file.owner_id != req.profile_id) {
            res.status(403).send("The client does not have access rights to the content");
            return;
        }

        //Check the columns. We don't want to change ID, Owner_id, dateCreated, createdAt, updatedAt
        const invalidColumn = ["id", "profile_id", "createdAt", "dateCreated"];
        for (const key in changes) {
            for (let i = 0; i < 2; i++) {
                if (key === invalidColumn[i]) {
                    res.status(400).json({
                        "error": "Bad Request",
                        "message": "Not allowed to change one of the columns"
                    });
                    return;
                }
            }
        }

        await file.update(changes, {transaction: transaction});

        await transaction.commit(); //Commit transaction
        res.status(200).send({ file: file});
    } catch (err) {
        await transaction.rollback(); //Rollback the transaction since error was thrown
        debugError(err);
        res.status(500).send("Internal server error");
    }
};

export { getAllUserData, createUserData, testCreateUserData, deleteFileById, updateFileLedger };

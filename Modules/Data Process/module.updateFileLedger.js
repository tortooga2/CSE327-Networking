import { Data, sequelize } from "../Database/module.db.js";
import { debugError } from "../module.debugHelpers.js";
import { Sequelize } from "sequelize";

export const updateFileLedger = async (req, res) => {
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

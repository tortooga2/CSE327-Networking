import { Data } from "../Database/module.db.js";
import { debugError } from "../module.debugHelpers.js";

//Should send the file back to the client when given proper file ID
export const getFileById = async (req, res) => {
    const { profile_id } = req.user;
    try {
        const file = await Data.findByPk(req.params.fileId);

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

        res.status(200).json({
            okay: true,
            file: file,
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

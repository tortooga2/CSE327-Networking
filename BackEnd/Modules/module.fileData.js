import { Data } from "./module.db.js";
import { debugMessage, debugError } from "./module.debugHelpers.js";

//Delete file by ID
const deleteFileById = async (req, res) => {
    const { id, owner_id } = req.body;
    try {
        //If deletedFile == 0, no file was deleted
        const deletedFile = await Data.destroy({
            where: {
                id: id,
                owner_id: owner_id,
            },
        });

        //Check if anything was deleted
        if (deletedFile == 0) {
            res.status(404).json({
                message: "File not found",
            });
            return; //Chase lemme know if this is bad practice. I put this to stop it from executing more code.
        }

        res.status(204).send();
    } catch (err) {
        debugError(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export { deleteFileById };
import { Data } from "./module.db";
import { debugMessage, debugError } from "./module.debugHelpers";

//Delete file by ID
const deleteFileById = async (req, res) => {
    const file_id = req.id;
    try {
        Data.destroy({
            where: {
                id: file_id,
            },
        });

        debugMessage("Deleted File");
        res.status(204);
    } catch (err) {
        debugError(err);
        res.status(500).send("Internal Server Error: Could Not Delete File")
    }
};

export { deleteFileById };
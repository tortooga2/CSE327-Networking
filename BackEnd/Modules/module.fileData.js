import { Data } from "./module.db";
import { debugMessage, debugError } from "./module.debugHelpers";

//Delete file by ID
const deleteFileById = async (req, res) => {
    const file_id = req.params.fileId; //Gets file Id from the url
    try {
        //If deletedFile == 0, no file was deleted
        const deletedFile = await Data.destroy({
            where: {
                id: file_id,
            },
        });

        //Check if anything was deleted
        if (deletedFile == 0) {
            res.status(404).send("File Not Found");
            return; //Chase lemme know if this is bad practice. I put this to stop it from executing more code.
        }

        debugMessage("Deleted File");
        res.status(204).send();
    } catch (err) {
        debugError(err);
        res.status(500).send("Internal Server Error: Could Not Delete File")
    }
};

export { deleteFileById };
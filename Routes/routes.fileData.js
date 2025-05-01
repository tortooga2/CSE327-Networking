import { Router } from "express";
import auth from "../Modules/module.auth.js";
import {
    ConnectFiles,
    createUserData,
    deleteFileById,
    getAllUserData,
    getFileById,
    sendFileToUser,
    updateFileLedger,
    testCreateUserData,
    createFileInDb,
    loadDataForFocusPage,
    uploadHelper,
    verifyFiles,
    getFileChunk,
} from "../Modules/Data Process/import.dataProcess.js";
import { Data } from "../Modules/Database/module.db.js";
import { debugMessage, debugError } from "../Modules/module.debugHelpers.js";

const fileDataRouter = Router();

fileDataRouter.use(auth.Verify);
fileDataRouter.delete("/delete", deleteFileById);
fileDataRouter.get("/user/:fileId", getFileById);
fileDataRouter.get("/all", getAllUserData);
fileDataRouter.post("/create", createUserData);
fileDataRouter.post("/send/:other_id/:file_id", sendFileToUser);
fileDataRouter.patch("/update/:id", updateFileLedger);
fileDataRouter.post("/connect", ConnectFiles);
fileDataRouter.post("/upload", createFileInDb);
fileDataRouter.get("/focus/:fileId", loadDataForFocusPage);

//New stuff
fileDataRouter.get("/upload-helper", uploadHelper);
fileDataRouter.post("/verify", verifyFiles);

//Chunk thing
fileDataRouter.get("/load", getFileChunk);

// Test the creation of a user data
fileDataRouter.post("/createtest", testCreateUserData);

// search endpoint
fileDataRouter.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const { profile_id } = req.user;
        if (!profile_id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Query database 
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

        // Filter on search query
        const searchResults = data.filter(file => {
            const searchTermLower = q.toLowerCase();
            return (
                file.name.toLowerCase().includes(searchTermLower) ||
                (file.metadata && file.metadata.description && 
                 file.metadata.description.toLowerCase().includes(searchTermLower))
            );
        });

        debugMessage('Search results:', searchResults);
        res.json({ files: searchResults });
    } catch (error) {
        debugError('Search error:', error);
        res.status(500).json({ 
            error: 'Failed to search files',
            details: error.message
        });
    }
});

export default fileDataRouter;

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
import { Data, sequelize } from "../Modules/Database/module.db.js";
import { debugMessage, debugError } from "../Modules/module.debugHelpers.js";
import { QueryTypes } from 'sequelize';

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

// Optimized search endpoint
fileDataRouter.get('/search', async (req, res) => {
    try {
        const { q, limit = 20, page = 1 } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const { profile_id } = req.user;
        if (!profile_id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Use SQL-level search with word similarity and pagination
        const query = `
            SELECT 
                "id", 
                "creator_username", 
                "name", 
                "type", 
                "metadata",
                "parents",
                "children",
                "createdAt",
                "updatedAt",
                word_similarity($query, "name") as similarity
            FROM "file_ledger"
            WHERE "owner_id" = $owner_id
            AND word_similarity($query, "name") >= 0.3
            ORDER BY similarity DESC
            LIMIT $limit OFFSET $offset
        `;

        const searchResults = await sequelize.query(query, {
            bind: {
                query: q,
                owner_id: profile_id,
                limit: limit,
                offset: (page - 1) * limit
            },
            type: QueryTypes.SELECT
        });

        debugMessage('Search results:', searchResults);
        res.json({ 
            files: searchResults,
            page,
            limit,
            total: searchResults.length 
        });
    } catch (error) {
        debugError('Search error:', error);
        res.status(500).json({ 
            error: 'Failed to search files',
            details: error.message
        });
    }
});

export default fileDataRouter;

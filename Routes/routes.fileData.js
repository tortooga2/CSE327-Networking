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
fileDataRouter.post("/upload-helper", uploadHelper);
fileDataRouter.post("/verify", verifyFiles);

//Chunk thing
fileDataRouter.get("/load", getFileChunk);

// Test the creation of a user data
fileDataRouter.post("/createtest", testCreateUserData);

export default fileDataRouter;

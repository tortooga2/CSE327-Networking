import { Router } from "express";
import auth from "../Modules/module.auth.js";
import {
    ConnectFiles,
    createUserData,
    deleteFileById,
    getAllUserData,
    testCreateUserData,
    loadDataForFocusPage,
    uploadHelper,
    verifyFiles,
    getFileChunk,
} from "../Modules/Data Process/import.dataProcess.js";

const fileDataRouter = Router();

fileDataRouter.use(auth.Verify);
fileDataRouter.delete("/delete", deleteFileById);
fileDataRouter.get("/all", getAllUserData);
fileDataRouter.post("/create", createUserData);
fileDataRouter.post("/connect", ConnectFiles);
fileDataRouter.get("/focus/:fileId", loadDataForFocusPage);

//New stuff
fileDataRouter.get("/upload-helper", uploadHelper);
fileDataRouter.post("/verify", verifyFiles);

//Chunk thing
fileDataRouter.get("/load", getFileChunk);

// Test the creation of a user data
fileDataRouter.post("/createtest", testCreateUserData);

export default fileDataRouter;

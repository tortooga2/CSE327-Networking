import { Router } from "express";
import auth from "../Modules/module.auth.js";
import {
    ConnectFiles,
    createUserData,
    deleteFileById,
    getAllUserData,
    getFileById,
    sendFileToUser,
    testCreateUserData,
    createFileInDb,
    loadDataForFocusPage,
} from "../Modules/Data Process/import.dataProcess.js";

const fileDataRouter = Router();

fileDataRouter.use(auth.Verify);
fileDataRouter.delete("/delete", deleteFileById);
fileDataRouter.get("/user/:fileId", getFileById);
fileDataRouter.get("/all", getAllUserData);
fileDataRouter.post("/create", createUserData);
fileDataRouter.post("/send/:other_id/:file_id", sendFileToUser);
fileDataRouter.post("/connect", ConnectFiles);
fileDataRouter.post("/upload", createFileInDb);
fileDataRouter.get("/focus/:fileId", loadDataForFocusPage);

// Test the creation of a user data
fileDataRouter.post("/createtest", testCreateUserData);

export default fileDataRouter;

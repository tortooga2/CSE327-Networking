import { Router } from "express";
import auth from "../Modules/module.auth.js";
import {
    getAllUserData,
    createUserData,
    testCreateUserData,
    deleteFileById,
    updateFileLedger,
    getFileById,
    sendFileToUser,
    ConnectFiles,
} from "../Modules/Data Process/module.fileData.js";

const fileDataRouter = Router();

fileDataRouter.use(auth.Verify);
fileDataRouter.delete("/delete/:id", deleteFileById);
fileDataRouter.get("/receive/:id", getFileById);
fileDataRouter.get("/all", getAllUserData);
fileDataRouter.post("/create", createUserData);
fileDataRouter.post("/send/:other_id/:file_id", sendFileToUser);
fileDataRouter.patch("/update/:id", updateFileLedger);
fileDataRouter.post("/connect", ConnectFiles);

// Test the creation of a user data
fileDataRouter.post("/createtest", testCreateUserData);

export default fileDataRouter;

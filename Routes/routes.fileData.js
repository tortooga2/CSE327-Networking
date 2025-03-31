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
} from "../Modules/Data Process/import.dataProcess.js";

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

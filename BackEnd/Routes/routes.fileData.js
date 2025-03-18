import { Router } from "express";
import auth from "../Modules/module.auth.js";
import {
    getAllUserData,
    createUserData,
    testCreateUserData,
    deleteFileById
} from "../Modules/module.fileData.js";

const fileDataRouter = Router();

fileDataRouter.use(auth.Verify);
fileDataRouter.delete("/delete/:id", deleteFileById);
fileDataRouter.get("/all", getAllUserData);
fileDataRouter.post("/create", createUserData);

// Test the creation of a user data
fileDataRouter.post("/createtest", testCreateUserData);



export default fileDataRouter;

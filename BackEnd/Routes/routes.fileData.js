import { Router } from "express";
import auth from "../Modules/module.auth.js";
import { deleteFileById } from "../Modules/module.fileData.js";

const fileDataRouter = Router();

fileDataRouter.use(auth.Verify);
fileDataRouter.delete("/delete:fileId", deleteFileById);

export default fileDataRouter;
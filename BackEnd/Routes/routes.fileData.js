import { Router } from "express";
import auth from "../Modules/module.auth.js";
import { deleteFileById } from "../Modules/module.fileData.js";

const fileDataRouter = Router();

fileDataRouter.delete("/delete/:fileId", deleteFileById);

export default fileDataRouter;
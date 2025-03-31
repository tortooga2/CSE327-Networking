import { Router } from "express";
import multer from "multer";

import auth from "../Modules/module.auth.js";
import {
    fileUpload,
    fileDownload,
    deleteFile,
} from "../Modules/S3 Stuff/module.s3funcs.js";
import { generateUploadUrl } from "../Modules/S3 Stuff/module.genUploadUrl.js";

const s3Router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

s3Router.use(auth.Verify);
s3Router.post("/upload", upload.single("file"), fileUpload);
s3Router.get("/download/:id", fileDownload);
s3Router.delete("/delete/:id", deleteFile);
s3Router.post("/getuploadpath", generateUploadUrl);

export default s3Router;

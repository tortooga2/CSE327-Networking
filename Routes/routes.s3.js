import { Router } from "express";
import multer from "multer";

import auth from "../Modules/module.auth.js";
import { fileupload } from "../Modules/S3 Stuff/module.s3funcs.js"


const s3Router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

s3Router.use(auth.Verify);
s3Router.post("/upload", upload.single('image'), fileupload);

export default s3Router;
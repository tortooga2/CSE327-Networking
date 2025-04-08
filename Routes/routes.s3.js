import { Router } from "express";

import auth from "../Modules/module.auth.js";
import { generateUploadUrl } from "../Modules/S3 Stuff/module.genUploadUrl.js";

const s3Router = Router();

s3Router.use(auth.Verify);
s3Router.get("/getuploadpath", generateUploadUrl);

export default s3Router;

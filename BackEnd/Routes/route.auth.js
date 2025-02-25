import { Router } from "express";
import cookieParser from "cookie-parser";
import auth from "../Modules/module.auth.js";

const auth_router = Router();
auth_router.use(cookieParser());

auth_router.get("/login", auth.Login);
auth_router.post("/signup", auth.Signup);
auth_router.post("/verify", auth.TestVerify);

export default auth_router;

import { Router } from "express";
import api from "../Modules/module.auth.js";
const authRouter = Router();

authRouter.post("/signup", api.Signup);
authRouter.post("/login", api.Login);
authRouter.post("/logout", api.Logout);
authRouter.get("/verify", api.TestVerify);

export default authRouter;

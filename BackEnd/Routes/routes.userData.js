import { Router } from "express";
import auth from "../Modules/module.auth.js";
import {
    getAllUserData,
    createUserData,
    testCreateUserData,
} from "../Modules/module.userData.js";

const userDataRouter = Router();

userDataRouter.use(auth.Verify);
userDataRouter.get("/all", getAllUserData);
userDataRouter.post("/create", createUserData);

// Test the creation of a user data
userDataRouter.post("/createtest", testCreateUserData);

export default userDataRouter;

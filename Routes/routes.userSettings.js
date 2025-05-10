import { Router } from "express";
import auth from "../Modules/module.auth.js";

import UpdateUserSetting from "../Modules/Data Process/module.updateUserSetting.js";

const userSettingsRouter = Router();

userSettingsRouter.use(auth.Verify);

userSettingsRouter.post("/update", UpdateUserSetting);

export default userSettingsRouter;

import { Router } from "express";
import auth from "../Modules/module.auth.js";

const schemaRouter = Router();

schemaRouter.use(auth.Verify);

const schema = {
    "/schema": {
        GET: {
            description: "Get the schema of the API",
            header: {
                "Content-Type": "application/json",
                credentials: "include",
            },
        },
    },
    "/auth/login": {
        POST: {
            description: "Login to the API",
            header: {
                "Content-Type": "application/json",
            },
            body: {
                email: "string",
                password: "string",
            },
        },
    },
    "/auth/signup": {
        POST: {
            description: "Signup to the API",
            header: {
                "Content-Type": "application/json",
            },
            body: {
                email: "string",
                password: "string",
            },
        },
    },
};

schemaRouter.get("/schema", (req, res) => {
    return res.json(schema);
});

export default schemaRouter;

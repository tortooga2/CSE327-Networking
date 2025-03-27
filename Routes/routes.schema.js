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
                credentials: "same-origin",
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
    "/auth/logout": {
        POST: {
            description: "Logout of the API",
            credientials: "include",
            header: {
                "Content-Type": "application/json",
            },
        },
    },

    "/auth/verify": {
        GET: {
            description: "Verify the user",
            credientials: "include",
            header: {
                "Content-Type": "application/json",
            },
        },
    },

    "/file/all": {
        GET: {
            description: "Get all the files",
            credientials: "include",
            header: {
                "Content-Type": "application/json",
            },
        },
    },
};

schemaRouter.get("/schema", (req, res) => {
    return res.json(schema);
});

export default schemaRouter;

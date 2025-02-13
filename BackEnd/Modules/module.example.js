import { Router } from "express";

const exampleRouter = Router();

// Define the routes for the module here:
// Example:
exampleRouter.get("/", (req, res) => {
    res.send({ message: "Hello from the example module", data: "Some data" });
});

export default exampleRouter;

import express from "express";
import path from "path";
import cors from "cors";

//Import the router from the module
import exampleRouter from "./Modules/module.example.js";

//Create an express application
const app = express();
const PORT = 80;
// Define the directory for the server
const __dirname = path.resolve();

// Add middleware to parse JSON
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
    console.log("CORS enabled");
    app.use(cors()); //Will remove once we deploy
}

//_____________________________________________________________________________________
// Add Enpoints Here:
//Example:
app.use("/example", exampleRouter);

//_____________________________________________________________________________________

//Try not to change the following code:
//Serve static files from the React app. Make sure you build the front end before running the server
// 'npm run build' in the FrontEnd/Networking-Solution directory
app.use(
    express.static(path.join(__dirname, "../FrontEnd/Networking-Solution/dist"))
);

app.get("*", (req, res) => {
    return res.sendFile(
        path.join(
            __dirname,
            "../FrontEnd/Networking-Solution/dist",
            "index.html"
        )
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

const DEBUG = process.env.DEBUG === "true";

const debugMessage = (message) => {
    if (DEBUG) {
        console.log(chalk.bgBlue(message));
    }
};

const debugError = (message) => {
    if (DEBUG) {
        console.error(chalk.bgRed(message));
    }
};



export { debugMessage, debugError, DEBUG };

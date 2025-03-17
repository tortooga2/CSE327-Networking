import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

const debugMessage = (message) => {
    if (process.env.DEBUG) {
        console.log(chalk.bgBlue(message));
    }
};

const debugError = (message) => {
    if (process.env.DEBUG) {
        console.error(chalk.bgRed(message));
    }
};

export { debugMessage, debugError };

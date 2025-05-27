import { CustomClient } from "../../types/bot_types";
import { printLine } from "../../utils/utils";

export default {
    name: "SIGINT",
    async execute(Client: CustomClient) {
        if (!Client.isShuttingDown) Client.isShuttingDown = true;
        else return;
        printLine("{bold.red SIGINT received, shutting down.}\n");

        process.exit(0);
    },
};
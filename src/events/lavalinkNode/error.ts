import { CustomClient } from "../../types/bot_types";
import { LavalinkNode } from "lavalink-client";
import { printLine } from "../../utils/utils";

export default {
    name: "error",
    async execute(Client: CustomClient, node: LavalinkNode, error: Error) {
        printLine(`{red Tried to load node id} {yellow ${node.id}} {red and it had a pretty bad error, it will not be used.}`);
        printLine(`{red ${error.message}}`);
        printLine("");
    },
};
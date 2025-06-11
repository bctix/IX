import { CustomClient } from "../../types/bot_types";
import { LavalinkNode } from "lavalink-client";
import { printLine } from "../../utils/utils";

export default {
    name: "connect",
    async execute(Client: CustomClient, node: LavalinkNode) {
        const info = await node.fetchInfo();

        let err = false;
        if (!info.plugins.some(plugin => plugin.name === "youtube-plugin")) {
            printLine(`{underline.bold.red youtube-plugin} {bold.red or some equivalent was not found on node id:} {yellow ${node.id}}`);
            err = true;
        }
        if (!info.plugins.some(plugin => { return (plugin.name === "lavasrc" || plugin.name === "lavasrc-plugin"); })) {
            printLine(`{underline.bold.red lavasrc} {bold.red or some equivalent was not found on node id:} {yellow ${node.id}}`);
            err = true;
        }

        if (err) {
            printLine("{yellow Please add these plugins or IX may work correctly}");
        }
    },
};
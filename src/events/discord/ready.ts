import { Events } from "discord.js";
import { CustomClient } from "../../types/bot_types";
import { deployApplicationCommands, registerEvents } from "../../utils/registry";
import { print, printLine } from "../../utils/utils";
import { lavalinkConfig, prefix } from "../../utils/constants";
import { client } from "../..";
import { createLavalinkManager } from "../../utils/lavalink";

export default {
    name: Events.ClientReady,
    async execute(Client: CustomClient) {
        print(` {green Logged in as} {bold.blue ${Client.user?.username}} {green with prefix:} {bold.blue ${prefix}}`);


        try {
            printLine("{yellow Deploying application commands...} ");

            await deployApplicationCommands(Client);

            print(`{green Complete!} {bold.blue ${Client.chatcommands.filter(cmd => !cmd.isAlias).size}} {green commands registered.}`);

            printLine("{yellow Creating lavalink manager...} ");
            Client.lavalink = await createLavalinkManager(client, lavalinkConfig);
            print("{green Complete!}");

            registerEvents(Client.lavalink.nodeManager, Client, "../events/lavalinkNode");
        }
        catch (e) {
            console.error(e);
        }


        printLine("{underline.bold.green Bot is ready!}");
    },
};
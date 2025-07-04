import { GatewayIntentBits } from "discord.js";
import { CustomClient } from "./types/bot_types";
import { registerEvents, registerCommands } from "./utils/registry";
import { printLine } from "./utils/utils";
import { botToken, enableMusic } from "./utils/constants";

export const client = new CustomClient(
    { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] },
);

async function main() {
    await registerEvents(client, client, "../events/discord");
    await registerEvents(process, client, "../events/process");
    await registerCommands(client, "../commands/normal");
    if (enableMusic) await registerCommands(client, "../commands/music");

    printLine("{yellow Starting bot...}");
    await client.login(botToken);
}

main();
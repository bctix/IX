import { GatewayIntentBits } from "discord.js";
import { CustomClient } from "./types/bot_types";
import dotenv from "dotenv";
import { registerEvents, registerCommands } from "./utils/registry";
import { printLine } from "./utils/utils";
import { enableMusic } from "./utils/constants";
dotenv.config();

export const client = new CustomClient(
    { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] },
);

async function main() {
    await registerEvents(client, client, "../events/discord");
    await registerEvents(process, client, "../events/process");
    await registerCommands(client, "../commands/normal");
    if (enableMusic) await registerCommands(client, "../commands/music");

    printLine("{yellow Starting bot...}");
    await client.login(process.env.DISCORD_TOKEN);
}

main();
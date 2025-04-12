import { GatewayIntentBits } from "discord.js";
import { CustomClient } from "./types/bot_classes";
import dotenv from "dotenv";
import { registerEvents, registerTextCommands } from "./utils/registry";
import { printLine } from "./utils/utils";
dotenv.config();

const client = new CustomClient(
	{ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] },
);

async function main() {
  await registerEvents(client, client, "../events/discord")
  await registerEvents(process, client, "../events/process");
  await registerTextCommands(client, "../commands");

  printLine("<y>Starting bot... ")
  await client.login(process.env.DISCORD_TOKEN);
}

main();
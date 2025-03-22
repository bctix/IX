import { Client, Collection, GatewayIntentBits } from "discord.js";
import { CustomClient } from "./types/bot_types.d";
import { registerEvents, registerTextCommands } from "./utils/registry";
import config from "../configs/config.json";

const client = new Client(
	{ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] },
) as CustomClient;

(async () => {
	client.chatcommands = new Collection();
	client.contextmenucommands = new Collection();
	client.categories = new Collection();

	await registerEvents(client, client, "../events/discord");
	await registerTextCommands(client, "../commands");

	await client.login(config.token);
})();
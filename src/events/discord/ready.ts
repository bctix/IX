import { Events } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { deployApplicationCommands, registerEvents, removeApplicationCommands } from "../../utils/registry";
import { initLavalink } from "../../utils/lavalink";

export default {
	name: Events.ClientReady,
	async execute(Client: CustomClient) {
		console.log("Bot started!");

		console.log("Deploying slash commands...");

		try {
			await deployApplicationCommands(Client);
			if (Client.user)
			{
				await initLavalink(Client);
			}
		}
		catch (e) {
			console.error(e);
		}

		console.log("Success!");

		console.log("Bot is ready!");
	},
};
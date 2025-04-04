import { ActivityType, Events } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { deployApplicationCommands } from "../../utils/registry";
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

		Client.user?.setPresence({
			status: "online",
			activities: [
				{
					name: "awesome music",
					state: ":)",
					type: ActivityType.Streaming,
					url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				}
			]
		})

		console.log("Bot is ready!");
	},
};
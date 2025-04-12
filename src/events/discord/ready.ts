import { ActivityType, Events } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { deployApplicationCommands } from "../../utils/registry";
import { initLavalink } from "../../utils/lavalink";
import { printLine, print } from "../../utils/utils";

export default {
	name: Events.ClientReady,
	async execute(Client: CustomClient) {
		print("<g>logged in as <b>"+Client.user?.username+"<g> with prefix: <b>"+process.env.PREFIX);

		printLine("<y>Deploying application commands... ")
		try {
			await deployApplicationCommands(Client);
			print(`<g>Complete! <b>${Client.chatcommands.filter(cmd => !cmd.isAlias).size} <g>commands registered.`);
			if (Client.user)
			{
				printLine("<y>Starting lavalink... ");
				await initLavalink(Client);
				print(`<g>Complete <b>${Client.lavalink.nodeManager.nodes.size} <g>nodes connected.`);
			}
		}
		catch (e) {
			console.error(e);
		}

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

		printLine("<g>Bot is ready!");
	},
};
import { ActivityType, Events } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { deployApplicationCommands } from "../../utils/registry";
import { initLavalink } from "../../utils/lavalink";
import { printLine, print, parseBool } from "../../utils/utils";
import { prefix } from "../../utils/constants";

export default {
	name: Events.ClientReady,
	async execute(Client: CustomClient) {
		print(` {green Logged in as} {bold.blue ${Client.user?.username}} {green with prefix:} {bold.blue ${prefix}}`);

		printLine("{yellow Deploying application commands...} ");
		try {
			await deployApplicationCommands(Client);
			print(`{green Complete!} {bold.blue ${Client.chatcommands.filter(cmd => !cmd.isAlias).size}} {green commands registered.}`);
			if (Client.user && !parseBool(process.env.DISABLE_LAVALINK)) {
				printLine("{yellow Starting lavalink...} ");
				await initLavalink(Client);
				print(`{green Complete} {blue.bold ${Client.lavalink.nodeManager.nodes.size}} {green nodes connected.}`);
			}
		} catch (e) {
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
		});

		printLine("{underline.bold.green Bot is ready!}");
	},
};
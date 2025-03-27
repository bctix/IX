import { Colors, EmbedBuilder, SendableChannels, User } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { Player, Track } from "lavalink-client";
import { getVibrantColorToDiscord } from "../../utils/utils";

export default {
    name: "playerDestroy",
    async execute(Client: CustomClient, player: Player, reason: string) {
		if (!player.textChannelId) return;
        const channel = Client.channels.cache.get(player.textChannelId);

		const embed = new EmbedBuilder();

		switch (reason) {
		case "stopRequest":
			embed.setTitle("Leaving VC");
			embed.setDescription("See-ya!");
			embed.setColor(Colors.Red);
			break;
		case "QueueEmpty":
			embed.setTitle("Leaving VC");
			embed.setDescription("I wasn't playing anything for a while.");
			embed.setColor(Colors.Red);
			break;
		case "Disconnected":
			embed.setTitle("Disconnected!");
			embed.setDescription("I was disconnected from the vc!");
			embed.setColor(Colors.Red);
			break;
		default:
			embed.setTitle("Leaving VC");
			embed.setDescription("Something happened to make me leave vc!");
			embed.setColor(Colors.Red);
			console.error("Unknown Player destroy: " + reason);
			break;
		}

		if (channel && channel.isSendable()) {
			channel.send({ embeds: [embed] });
		}
    },
};

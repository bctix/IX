import { Colors, EmbedBuilder } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { Player } from "lavalink-client";

export default {
    name: "queueEnd",
    async execute(Client: CustomClient, player: Player) {
		if (!player.textChannelId) return;
		const channel = Client.channels.cache.get(player.textChannelId);

		const embed = new EmbedBuilder();

		embed.setTitle("Queue ended!");
		embed.setDescription("Leaving if another song is not played in 2 minutes.");
		embed.setColor(Colors.Red);

		if (channel && channel.isSendable()) {
			channel.send({ embeds: [embed] });
		}
    },
};

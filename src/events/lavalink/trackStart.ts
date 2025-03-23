import { Colors, EmbedBuilder, SendableChannels, User } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { Player, Track } from "lavalink-client";
import { getVibrantColorToDiscord } from "../../utils/utils";

export default {
    name: "trackStart",
    async execute(Client: CustomClient, player: Player, track: Track) {
        if (!player.textChannelId) return;
		const channel = Client.channels.cache.get(player.textChannelId);
		const guild = Client.guilds.cache.get(player.guildId);
		const member = guild?.members.cache.get((track.requester as User).id);

		const embed = new EmbedBuilder();

		embed.setTitle("Now playing song:");
		embed.setDescription(`[${track.info.title}](${track.info.uri})`);
		embed.addFields(
			{
				name: "Artist", value: `${track.info.author}`, inline: true,
			},
			{
				name: "Source", value: `${track.info.sourceName}`, inline: true,
			},
		);

		embed.setColor(Colors.Green);
		if (track.info.artworkUrl) {
			embed.setThumbnail(track.info.artworkUrl);
			try {
				embed.setColor(await getVibrantColorToDiscord(track.info.artworkUrl));
			}
			catch (error) {
				console.error("Error fetching vibrant color:", error);
			}
		}

		if (member) {embed.setFooter({ iconURL: member?.displayAvatarURL({}), text: `Requested by ${member.nickname ?? member.user.displayName ?? member.user.username ?? "Unknown user"}` });}

		if (channel && channel.isSendable()) {
			(channel as SendableChannels).send({ embeds: [embed] });
		}
    },
};

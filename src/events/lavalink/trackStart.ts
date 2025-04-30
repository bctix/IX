import { ButtonBuilder, ButtonStyle, Colors, ContainerBuilder, GuildMember, hyperlink, MessageFlags, SectionBuilder, SendableChannels, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder, User, userMention } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { Player, Track } from "lavalink-client";
import { getVibrantColorToDiscord, msToTime } from "../../utils/utils";

// so apparently, sections NEED thumbnails, or it throws an error, i did not know this
// this was made in a panic so i may need to relook this. (same with globalplay)
async function buildTopPart(track: Track, container: ContainerBuilder) {
	if (track.info.artworkUrl) {
		const topSection = new SectionBuilder();
		const topTitle = new TextDisplayBuilder().setContent(
			[
				"### Now playing song",
				`### ${hyperlink(`${track.info.title}`, track.info.uri)}`,
				`${hyperlink(`- ${track.info.author}`, track.info.uri)}`,
			].join("\n")
		);
	
		topSection.addTextDisplayComponents(topTitle);
	
		if (track.info.artworkUrl) {
			const col = await getVibrantColorToDiscord(track.info.artworkUrl);
			if (col)
				container.setAccentColor(col);
	
			const thumbnail = new ThumbnailBuilder().setURL(track.info.artworkUrl);
			topSection.setThumbnailAccessory(thumbnail);
		} else {
			container.setAccentColor(Colors.Green);
		}
		
		container.addSectionComponents(topSection);
	} else {
		const topTitle = new TextDisplayBuilder().setContent(
			[
				"### Now playing song",
				`### ${hyperlink(`${track.info.title}`, track.info.uri)}`,
				`${hyperlink(`- ${track.info.author}`, track.info.uri)}`,
			].join("\n")
		);

		container.addTextDisplayComponents(topTitle);
	}
	
}

export default {
    name: "trackStart",
    async execute(Client: CustomClient, player: Player, track: Track) {
        if (!player.textChannelId) return;
		const channel = Client.channels.cache.get(player.textChannelId);

		const container = new ContainerBuilder();

		await buildTopPart(track, container);

		container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

		const middleText = new TextDisplayBuilder().setContent(
			[
				`**Duration**:\n${track.info.isStream ? "Live" : msToTime(track.info.duration)}\n`,
				`-# Requested by: ${(track.requester as User).displayName ?? (track.requester as User).username}`,
			].join("\n")
		);

		container.addTextDisplayComponents(middleText);
		container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

		const skipButton = new ButtonBuilder()
			.setLabel("Skip")
			.setStyle(ButtonStyle.Primary)
			.setCustomId("skip")
			.setEmoji("⏭️");

		const toggleLoop = new ButtonBuilder()
			.setLabel("Toggle loop")
			.setStyle(ButtonStyle.Secondary)
			.setCustomId("toggleLoop");
		
		if (player.queue.tracks.length === 0)
			skipButton.setDisabled(true); 

		container.addActionRowComponents(row => row.addComponents(skipButton, toggleLoop));

		if (channel && channel.isSendable()) {
			const res = await (channel as SendableChannels).send({ 
				components: [container],
				flags: MessageFlags.IsComponentsV2,
			});


			const collector = res.createMessageComponentCollector({ filter: i => i.user.id === (track.requester as User).id, time: 120_000 });

			collector.on("collect", async (i) => {

				if (!player) {
					skipButton.setDisabled(true);
					toggleLoop.setDisabled(true);
					await i.update({ components: [container] });
					return;
				}

				if ((i.member as GuildMember).voice.channelId !== player.voiceChannelId) {
					await i.update({ components: [container] });
					return;
				}

				if (i.customId === "skip") {
					if (player.queue.tracks.length > 0) await player.skip();
					collector.stop();
					await res.delete();
					return;
				}

				if (i.customId === "toggleLoop") {
					switch (player.repeatMode) {
						case "off":
							await player.setRepeatMode("track");
							toggleLoop.setLabel("Looping track").setStyle(ButtonStyle.Success);
							break;
						case "track":
							await player.setRepeatMode("queue");
							toggleLoop.setLabel("Looping queue").setStyle(ButtonStyle.Success);
							break;
						case "queue":
							await player.setRepeatMode("off");
							toggleLoop.setLabel("Looping off").setStyle(ButtonStyle.Secondary);
							break;
					}
				}
				
				await i.update({ components: [container] });
			});
		}
    },
};

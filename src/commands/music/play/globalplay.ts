import { SearchPlatform } from "lavalink-client/dist/types";
import { ChatCommandExecute } from "../../../types/bot_classes";
import { commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";
import { ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildTopPart(res: any, container: ContainerBuilder) {
	const topSection = new SectionBuilder();
	const topTitle = new TextDisplayBuilder().setContent(
		[
			res.loadType === "playlist" ? "### Adding playlist to queue" : "### Adding song to queue",
			res.loadType === "playlist" ? `### ${res.playlist?.name}` : `### ${res.tracks[0].info.title}\n${res.tracks[0].info.author}`,
		].join("\n")
	);

	if (res.loadType === "playlist") {
		if (res.playlist?.thumbnail) {
			const thumbnail = new ThumbnailBuilder().setURL(res.playlist?.thumbnail);
			topSection.setThumbnailAccessory(thumbnail);
		} else {
			container.addTextDisplayComponents(topTitle);
			return;
		}
	} else {
		if (res.tracks[0].info.artworkUrl) {
			const thumbnail = new ThumbnailBuilder().setURL(res.tracks[0].info.artworkUrl);
			topSection.setThumbnailAccessory(thumbnail);
		} else {
			container.addTextDisplayComponents(topTitle);
			return;
		}
	}

	topSection.addTextDisplayComponents(topTitle);
	container.addSectionComponents(topSection);
}

export default {
	ignore: true,
	playSong: async function playSong(command: ChatCommandExecute, source: SearchPlatform) {
		const query = command.args[0] as string;

		if (!query || query === "") {
			await command.data.reply("You need to search for a song!");
			return;
		}

		try {
			const player = getLavalinkPlayer(commandToLavaData(command));

			if (!player) {
				await command.data.reply("I couldn't get what vc you are in!");
				return;
			}

			const res = await player.search({ query: query, source: source }, command.data.member?.user);

			if (!res || !res.tracks?.length) {
				await command.data.reply("Couldn't find any songs!");
				return;
			}

			const wasPlaying = player.connected;

			if (!player.connected) await player.connect();

			await player.queue.add(
				res.loadType === "playlist" ? res.tracks : res.tracks[0],
			);

			if (!player.playing) {await player.play();}

			if (wasPlaying) {
				const container = new ContainerBuilder();

				await buildTopPart(res, container);

				container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

				const playButton = new ButtonBuilder()
							.setLabel("Play now")
							.setStyle(ButtonStyle.Primary)
							.setCustomId("play")
							.setEmoji("⏭️");
				
				if (res.loadType !== "playlist") container.addActionRowComponents(row => row.addComponents(playButton));

				const message = await command.data.reply({ 
					components: [container],
					flags: MessageFlags.IsComponentsV2
				});

				const collector = message.createMessageComponentCollector({ filter: (i) => i.user.id === command.data.member?.user.id, time: 60_000 });
			
				collector.on("collect", async (i) => {

					if (!player) {
						playButton.setDisabled(true);
						await i.update({ components: [container] });
						return;
					}

					if (i.customId === "play") {
						const trackIdx = player.queue.tracks.indexOf(res.tracks[0]);
						const removeTrack = await player.queue.remove(trackIdx);
						if (removeTrack != null) {
							const removedTrack = removeTrack.removed[0];
							await player.queue.add(removedTrack, 0);
							await player.skip();
						}
						await message.delete();
					}
				});
			} 
		} catch (e) {
			console.error(e);
		}
	},
};
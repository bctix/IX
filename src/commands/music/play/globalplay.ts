import { SearchPlatform } from "lavalink-client/dist/types";
import { ChatCommandExecute } from "../../../types/bot_classes";
import { commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";
import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";

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
				const embed = new EmbedBuilder()
					.setTitle(`Added ${res.loadType === "playlist" ? "playlist" : "song"} to queue!`)
					.setDescription(`${res.loadType === "playlist" ? `[${res.playlist?.name}](${query})` : `[${res.tracks[0].info.title}](${res.tracks[0].info.uri})`}`);

				if (res.loadType !== "playlist") {
					const track = res.tracks[0];

					if (track.info.artworkUrl) embed.setThumbnail(track.info.artworkUrl);

					embed.addFields(
						{ name: "Artist", value: track.info.author ?? "Unknown", inline: true },
					);

					if (track.info.sourceName) {
						embed.addFields(
							{ name: "Source", value: `${track.info.sourceName}`, inline: true },
						);
					}
				}

				await command.data.reply({ embeds: [embed] });
			}
			else if (!command.isMessage) {await (command.data as ChatInputCommandInteraction).reply({ content: "Playing your song", flags: MessageFlags.Ephemeral });}
		}
		catch (e) {
			console.error(e);
		}
	},
};
import { ApplicationCommandOptionType, EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand({
	name: "move",
	description: "Here there",
	options: [
		{
			name: "position",
			description: "What song to move.",
			required: true,
			default: 1,
			type: ApplicationCommandOptionType.Integer,
		},
		{
			name: "newposition",
			description: "New position for the song.",
			required: true,
			default: 1,
			type: ApplicationCommandOptionType.Integer,
		},
	],
	category: "music",
	aliases: ["mv"],
	argParser(str) {
		const args = str.split(" ");
		if (args[0] == null || args[1] == null) return [null];
		return [Math.round(parseInt(args[0])), Math.round(parseInt(args[1]))];
	},
	execute: async function(command: ChatCommandExecute) {
		try {
			if (command.args[0] == null || command.args[1] == null || isNaN(command.args[0]) || isNaN(command.args[1])) {
				command.data.reply("Invalid arguments! Please provide both position and new position.");
				return;
			}
			const position = command.args[0] - 1;
			const newPosition = command.args[1] - 1;

			const player = getLavalinkPlayer(commandToLavaData(command));
			if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
			const vcId = (command.data.member as GuildMember).voice.channelId;

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
			if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

			const removeTrack = await player.queue.remove(position);
			if (removeTrack == null) {command.data.reply("There is no song at that position in the queue!"); return;}
			const removedTrack = removeTrack.removed[0];

			await player.queue.add(removedTrack, newPosition);

			const embed = new EmbedBuilder()
				.setTitle("Moved song")
				.setDescription(`[${removedTrack.info.title}](${removedTrack.info.uri}) moved to position ${newPosition + 1}`);
			if (removedTrack.info.artworkUrl) {embed.setThumbnail(removedTrack.info.artworkUrl);}

			await command.data.reply({ embeds:[embed] });
		}
		catch (e) {
			console.error(e);
		}
	},
});

export default textcommand;
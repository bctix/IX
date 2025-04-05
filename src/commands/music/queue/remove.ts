import { ApplicationCommandOptionType, EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand({
	name: "remove",
	description: "Who's Steve Jobs?",
	options: [
		{
			name: "position",
			description: "What song to remove.",
			required: true,
			default: 1,
			type: ApplicationCommandOptionType.Integer,
		},
	],
	category: "music (queue)",
	aliases: ["rm"],
	usage: "Removes the selected song from the queue.",
	argParser(str) {
		let val = Math.round(parseInt(str));
		if (isNaN(val)) val = 0;
		return [val];
	},
	execute: async function(command: ChatCommandExecute) {
		try {
			const position = command.args[0] - 1;

			const player = getLavalinkPlayer(commandToLavaData(command));
			if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
			const vcId = (command.data.member as GuildMember).voice.channelId;

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
			if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

			const removeTrack = await player.queue.remove(position);
			if (removeTrack == null) {command.data.reply("There is no song at that position in the queue!"); return;}

			const removedTrack = removeTrack.removed[0];
			if (removedTrack == null) {command.data.reply("There is no song at that position in the queue!");}

			const embed = new EmbedBuilder()
				.setTitle("Removed song")
				.setDescription(`[${removedTrack.info.title}](${removedTrack.info.uri})`);
			if (removedTrack.info.artworkUrl) {embed.setThumbnail(removedTrack.info.artworkUrl);}

			await command.data.reply({ embeds:[embed] });
		}
		catch (e) {
			console.error(e);
		}
	},
});

export default textcommand;
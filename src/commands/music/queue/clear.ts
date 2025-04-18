import { EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand({
	name: "clear",
	description: "Begone!",
	category: "music (queue)",
	aliases: ["cl"],
	usage: "Removes all songs from queue.",
	execute: async function(command: ChatCommandExecute) {
		try {
			const player = getLavalinkPlayer(commandToLavaData(command));
			if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
			const vcId = (command.data.member as GuildMember).voice.channelId;

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
			if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

			const deletedTracks = await player.queue.splice(0, player.queue.tracks.length);

			const embed = new EmbedBuilder();
			if(!deletedTracks) {
				embed.setTitle("The queue is empty!")
				.setColor("Red");
			} else {
				embed.setTitle("Cleared queue!")
				.setDescription(`Removed ${deletedTracks.length ? deletedTracks.length : 1} track${deletedTracks.length > 1 ? "s" : ""}`)
				.setColor("Red");
			}
			

			await command.data.reply({ embeds:[embed] });
		} catch (e) {
			console.error(e);
		}
	},
});

export default textcommand;
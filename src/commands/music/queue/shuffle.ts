import { GuildMember } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand({
	name: "shuffle",
	description: "Feeling lucky?",
	aliases: ["sh"],
	category: "music (queue)",
	usage: "Shuffles the queue.",
	execute: async function(command: ChatCommandExecute) {
		try {
			const player = getLavalinkPlayer(commandToLavaData(command));
			if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
			const vcId = (command.data.member as GuildMember).voice.channelId;

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
			if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

			await player.queue.shuffle();

			await command.data.reply("Shuffled queue!");
		}
		catch (e) {
			console.error(e);
		}
	},
});

export default textcommand;
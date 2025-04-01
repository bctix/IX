import { GuildMember } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = {
	name: "resume",
	description: "Press play!",
	aliases: ["rs"],
	category: "music",
	execute: async function(command: ChatCommandExecute) {
		try {
			const player = getLavalinkPlayer(commandToLavaData(command));
			if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
			const vcId = (command.data.member as GuildMember).voice.channelId;

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
			if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

			if (player.paused) { await player.resume(); }
			else { command.data.reply("I'm already unpaused!"); return; }

			await command.data.reply("Resumed song!");
		}
		catch (e) {
			console.error(e);
		}
	},
};

export default textcommand;
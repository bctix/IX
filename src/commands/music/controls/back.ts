import { GuildMember } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = {
	name: "back",
	description: "Yes, hello! I was wondering if you could play that song again!",
	aliases: ["b"],
	category: "music",
	execute: async function(command: ChatCommandExecute) {
		try {
			const player = getLavalinkPlayer(commandToLavaData(command));
			if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
			const vcId = (command.data.member as GuildMember).voice.channelId;

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
			if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

			const previous = await player.queue.shiftPrevious();
			if (!previous) { await command.data.reply("No previous track found!"); return; }
			if (player.queue.current) await player.queue.add(player.queue.current, 0);
			await player.play({ clientTrack: previous });

			await command.data.reply({ content: "Playing previous song!" });
		}
		catch (e) {
			console.error(e);
		}
	},
};

export default textcommand;
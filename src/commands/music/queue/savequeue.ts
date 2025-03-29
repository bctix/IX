import { AttachmentBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";
import { compressToUint8Array } from "lz-string";

const textcommand: ChatCommand = new ChatCommand({
	name: "savequeue",
	description: "Like this setup?",
	aliases: ["sq"],
	execute: async function(command: ChatCommandExecute) {
		try {
			const player = await getLavalinkPlayer(commandToLavaData(command));
			if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
			const vcId = (command.data.member as GuildMember).voice.channelId;

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
			if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}
			if (player.queue.tracks.length < 0) {command.data.reply("There's nothing to save!"); return;}

			const tracks = player.queue.tracks;
			const curSong = player.queue.current;

			const queue = [];
			queue.push("ixqueuefile");
			if (curSong) queue.push(curSong.info.uri);
			tracks.forEach(track => {
				queue.push(track.info.uri);
			});

			const queuestring = queue.join(",");
			const compressedstring = compressToUint8Array(queuestring);
			const buffer = Buffer.from(compressedstring);
			await command.data.reply({ content: "Heres your queue!", files: [new AttachmentBuilder(buffer, { name: "queue.ixqueue" })] });
		}
		catch (e) {
			console.error(e);
		}
	},
});

export default textcommand;
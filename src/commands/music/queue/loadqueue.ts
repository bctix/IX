import { ApplicationCommandOptionType } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";
import { decompressFromUint8Array } from "lz-string";

const textcommand: ChatCommand = new ChatCommand({
	name: "loadqueue",
	description: "Got something for me?",
	options: [
		{
			name: "file",
			description: "The queue file.",
			required: true,
			type: ApplicationCommandOptionType.Attachment,
			default: "",
		},
	],
	aliases: ["lq"],
	argParser(str, message) {
		return [message.attachments.first()];
	},
	execute: async function(command: ChatCommandExecute) {
		try {
			const queuefile = command.args[0];
			if (!queuefile) {command.data.reply("I need a file!"); return;}
			if (!queuefile.name.endsWith(".ixqueue")) {command.data.reply("It needs to be a \".ixqueue\" file!"); return;}
			const fileurl = queuefile.url;

			const player = await getLavalinkPlayer(commandToLavaData(command));

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}

			const res = await fetch(fileurl);

			if (!res.ok) {command.data.reply("Something went wrong trying to load the file!"); return;}

			const array = new Uint8Array(await res.arrayBuffer());
			const decodedtext = decompressFromUint8Array(array);
			if (!decodedtext) {
				command.data.reply("Failed to read file. It may be corrupted.");
				return;
			}
			const finalArr = decodedtext.split(",");
			if (finalArr.shift() != "ixqueuefile") {command.data.reply("This is not a vaild queue file."); return;}

			for await (const link of finalArr) {
				const songres = await player.search({ query: link }, command.data.member?.user);

				if (!player.connected) await player.connect();

				await player.queue.add(songres.tracks[0]);
			}

			if (!player.playing) await player.play();

			await command.data.reply("Added local queue!");
		}
		catch (e) {
			console.error(e);
		}
	},
});

export default textcommand;
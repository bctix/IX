import { ApplicationCommandOptionType } from "discord.js";
import { ChatCommand, ChatCommandExecute } from "../../types/bot_types.d";

const textcommand: ChatCommand = new ChatCommand();
textcommand.name = "echo";
textcommand.description = "Echoes the text you provide!";
textcommand.options = [
	{
		name: "text",
		description: "Text to echo!",
		required: true,
		default: "-# you didn't type anything...",
		type: ApplicationCommandOptionType.String,
	},
];
textcommand.argParser = (str) => {
	return [str];
};
textcommand.execute = (command: ChatCommandExecute) => {
	const textToEcho = command.args[0];
	command.data.reply(`${textToEcho}\n-# echoing ${command.data.member?.user.username}`);
};

export default textcommand;
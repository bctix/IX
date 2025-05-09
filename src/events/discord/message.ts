import { Events, Message } from "discord.js";
import { ChatCommandExecute, CustomClient } from "../../types/bot_classes";
import { devs, prefix } from "../../utils/constants";
import { printLine } from "../../utils/utils";

export default {
    name: Events.MessageCreate,
    async execute(client: CustomClient, message: Message) {
        if (!client.user) return;
		if (message.author.bot) return;

		const prefixRegex = new RegExp(`^(<@${client.user.id}>|${prefix})`);
		if (!prefixRegex.test(message.content)) return;

		const match = message.content.match(prefixRegex);
		if (!match) return;
		const [, matchedPrefix] = match;

		const msgargs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		const cmdName = (msgargs.shift() || "").toLowerCase();

		const command = client.chatcommands.get(cmdName);

		if (!command) return;
		if (!message.member) { message.reply("Something went wrong!"); return; }
		if (command.devOnly && !devs.includes(message.member.user.id)) return;

		let args: string[] = [];

		const execute = new ChatCommandExecute(client, command, message);

		if (command.argParser) {
			args = command.argParser(msgargs.join(" "), message);
		}

		execute.args = args;

		try {
			await command.execute(execute);
		} catch (e) {
			printLine(`{red bold There was an error executing the command ${command.name}:} ${e}`);
		}
    },
};
import { Events, Message } from "discord.js";
import config from "../../../configs/config.json";

// for some reason, this file only wants the ".d" and idk why
import { CustomClient, ChatCommandExecute } from "../../types/bot_types.d";

export default {
	name: Events.MessageCreate,
	once: false,
	async execute(client: CustomClient, message: Message) {
		if (!client.user) return;
		if (message.author.bot) return;

		const prefixRegex = new RegExp(`^(<@${client.user.id}>|${config.prefix})`);
		if (!prefixRegex.test(message.content)) return;

		const match = message.content.match(prefixRegex);
		if (!match) return;
		const [, matchedPrefix] = match;

		const msgargs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		const cmdName = (msgargs.shift() || "").toLowerCase();

		const command = client.chatcommands.get(cmdName);

		if (!command) return;
		if (!message.member) { message.reply("Something went wrong!"); return; }
		if (command.devOnly && !config.devs.includes(message.member.user.id)) return;

		let args: string[] = [];

		const execute = new ChatCommandExecute(client, command, message);

		if (command.argParser) {
			args = command.argParser(msgargs.join(" "), message);
		}

		execute.args = args;

		command.execute(execute);
	},
};
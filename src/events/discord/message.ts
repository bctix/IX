import { Events, Message } from "discord.js";
import { ChatCommandExecute, ChatCommandFlags, CustomClient } from "../../types/bot_types";
import { devs, prefix } from "../../utils/constants";
import { checkChatFlag, printLine } from "../../utils/utils";

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
        if (checkChatFlag(command, ChatCommandFlags.NoPrefix)) return;
        if (checkChatFlag(command, ChatCommandFlags.DevOnly) && !devs.includes(message.member.user.id)) return;

        let args: string[] = [];

        const execute = new ChatCommandExecute(client, command, message);

        if (command.argParser) {
            args = command.argParser(msgargs.join(" "), message);
        }

        execute.args = args;

        try {
            await command.execute(execute);
        }
        catch (e: unknown) {
            await execute.data.reply("Something went wrong running the command!");
            printLine("{bold.red There was an error executing the command:} {underline.red " + command.name + "}");
            if (e instanceof Error) printLine(e.stack + "\n");
        }
    },
};
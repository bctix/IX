import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_classes";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "ping",
        description: "Ping pong!",
        category: "misc",
        usage: "Sends back pong.",
        argParser(str) {
            return [str];
        },
        async execute(execute: ChatCommandExecute) {
            execute.data.reply("Pong! from IX!");
        },
    } as ChatCommandOptions
);

export default textcommand;
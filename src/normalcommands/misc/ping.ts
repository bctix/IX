import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_types";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "ping",
        description: "Ping pong!",
        usage: "Sends back pong!",
        argParser(str) {
            return [str];
        },
        async execute(execute: ChatCommandExecute) {
            execute.data.reply("Pong!");
        },
    } as ChatCommandOptions,
);

export default textcommand;
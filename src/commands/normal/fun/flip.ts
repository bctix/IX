import { randomInt } from "mathjs";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_types";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "flip",
        description: "feeling lucky?",
        usage: "Sends back heads or tails",
        category: "fun",
        async execute(command: ChatCommandExecute) {
            const side = randomInt(0, 2) === 0 ? "Heads" : "Tails";
            await command.data.reply(`**${side}**`);
        },
    } as ChatCommandOptions,
);

export default textcommand;
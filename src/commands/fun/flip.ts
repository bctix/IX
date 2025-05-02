import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_classes";
import { randomInt } from "mathjs";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "flip",
        description: "Gambling!",
        category: "fun",
        usage: "Sends back heads or tails.",
        async execute(command: ChatCommandExecute) {
            const result = randomInt(0, 2) == 0 ? "Heads" : "Tails";
            await command.data.reply(`**${result}!**`);
        },
    } as ChatCommandOptions
);

export default textcommand;
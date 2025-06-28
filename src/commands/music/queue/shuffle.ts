import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { getLavalinkPlayer, commandToLavaData, checkPlayer } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "shuffle",
        description: "Feeling lucky?",
        aliases: ["sh"],
        category: "music (queue)",
        usage: "Shuffles the queue.",
        execute: async function(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            await player.queue.shuffle();

            await command.data.reply("Shuffled queue!");
        },
    } as ChatCommandOptions,
);

export default textcommand;
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "pause",
        description: "Don't pause!",
        aliases: ["pa"],
        category: "music (controls)",
        usage: "Pauses the current song.",
        argParser(str: string) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            if (!player.paused) { await player.pause(); }
            else { command.data.reply("I'm already paused!"); return; }

            await command.data.reply("Paused song!");
        },
    } as ChatCommandOptions,
);

export default textcommand;
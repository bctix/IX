import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "resume",
        description: "Press play!",
        aliases: ["re"],
        category: "music (controls)",
        usage: "Resumes the current song",
        argParser(str: string) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            if (player.paused) { await player.resume(); }
            else { command.data.reply("I'm already unpaused!"); return; }

            await command.data.reply("Paused song!");
        },
    } as ChatCommandOptions,
);

export default textcommand;
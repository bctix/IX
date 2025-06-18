import { ApplicationCommandOptionType } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "skip",
        description: "Don't like this one?",
        aliases: ["s"],
        usage: "Skips the current song. If a position is given, then skip to that song in the queue.",
        category: "music (controls)",
        options: [
            {
                name: "position",
                description: "What song to skip.",
                required: false,
                default: 0,
                type: ApplicationCommandOptionType.Integer,
            },
        ],
        argParser(str: string) {
            const int = Math.round(parseInt(str));
            if (isNaN(int)) return [0];
            return [parseInt(str)];
        },
        async execute(command: ChatCommandExecute) {
            const position = command.args[0];
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            if (position >= player.queue.tracks.length) {
                command.data.reply("There is no song at that position!");
                return;
            }

            await player.skip(position);

            await command.data.reply("Skipped song!");
        },
    } as ChatCommandOptions,
);

export default textcommand;
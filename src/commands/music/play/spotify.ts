import { ApplicationCommandOptionType } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { playSong } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "spotify",
        description: "Play some tunes!",
        aliases: ["sp"],
        usage: "Identical to `play` but searches Spotify instead.",
        options: [
            {
                name: "query",
                description: "Song title or link.",
                type: ApplicationCommandOptionType.String,
                default: "",
                required: true,
            },
        ],
        category: "music (play)",
        argParser(str: string) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            await playSong(command, command.args[0], "spsearch");
        },
    } as ChatCommandOptions,
);

export default textcommand;
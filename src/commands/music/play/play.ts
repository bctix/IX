import { ApplicationCommandOptionType } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { playSong } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "play",
        description: "Play some tunes!",
        aliases: ["p"],
        usage: "Plays a song from Youtube Music with a search query, or any other service with a link.",
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
            await playSong(command, command.args[0], "ytmsearch");
        },
    } as ChatCommandOptions,
);

export default textcommand;
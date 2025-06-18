import { ApplicationCommandOptionType } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../types/bot_types";
import { playSong } from "../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "soundcloud",
        description: "Play some tunes!",
        aliases: ["sc"],
        usage: "Identical to `play` but searches Soundcloud instead.",
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
            await playSong(command, command.args[0], "scsearch");
        },
    } as ChatCommandOptions,
);

export default textcommand;
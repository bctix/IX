import { ApplicationCommandOptionType } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import globalplay from "./globalplay";

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
                required: true
            }
        ],
        category: "music (play)",
        argParser(str: string) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
           globalplay.playSong(command, "ytmsearch");
        },
    } as ChatCommandOptions
);

export default textcommand;
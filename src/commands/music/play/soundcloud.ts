import { ApplicationCommandOptionType } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../../types/bot_classes';
import globalplay from './globalplay';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "soundcloud",
        description: "Play some tunes!",
        aliases: ["sc"],
        usage: "Identical to `play` but searches Soundcloud.",
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
        argParser(str: string ) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
           globalplay.playSong(command, "scsearch");
        },
    } as ChatCommandOptions
);

export default textcommand;
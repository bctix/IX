import { ApplicationCommandOptionType, ChatInputCommandInteraction, Message } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../../types/bot_classes';
import globalplay from './globalplay';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "applemusic",
        description: "Play some tunes!",
        aliases: ["am"],
        options: [
            {
                name: "query",
                description: "Song title or link.",
                type: ApplicationCommandOptionType.String,
                default: "",
                required: true
            }
        ],
        argParser(str: string, message: Message) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
           globalplay.playSong(command, "amsearch");
        },
    } as ChatCommandOptions
);

export default textcommand;
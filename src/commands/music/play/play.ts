import { ApplicationCommandOptionType, ChatInputCommandInteraction, Message } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../../types/bot_classes';
import globalplay from './globalplay';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "play",
        description: "Play some tunes!",
        aliases: ["p"],
        options: [
            {
                name: "query",
                description: "Song title or link.",
                type: ApplicationCommandOptionType.String,
                default: "",
                required: true
            }
        ],
        category: "music",
        argParser(str: string, message: Message) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
           globalplay.playSong(command, "ytmsearch");
        },
    } as ChatCommandOptions
);

export default textcommand;
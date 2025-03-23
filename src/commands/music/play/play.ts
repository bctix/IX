import { ChatInputCommandInteraction, Message } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../../types/bot_classes';
import globalplay from './globalplay';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "play",
        description: "Ping pong!",
        argParser(str: string, message: Message) {
            return [str];
        },
        async execute(execute: ChatCommandExecute) {
           globalplay.playSong(execute, "ytmsearch");
        },
    } as ChatCommandOptions
);

export default textcommand;
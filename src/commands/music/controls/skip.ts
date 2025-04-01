import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, Message, MessageFlags } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../../types/bot_classes';
import { getLavalinkPlayer, commandToLavaData } from '../../../utils/lavalink';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "skip",
        description: "Dont like this one?",
        aliases: ["s"],
        options: [
            {
                name: "position",
                description: "What song to skip.",
                required: false,
                default: 0,
                type: ApplicationCommandOptionType.Integer,
            },
        ],
        category: "music",
        argParser(str, message) {
            return [parseInt(str)];
        },
        async execute(command: ChatCommandExecute) {
            try {
                const position = command.args[0];

                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;

                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

                await player.skip(position);

                await command.data.reply("Skipped song!");
            }
            catch (e) {
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
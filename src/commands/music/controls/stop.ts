import { ChatInputCommandInteraction, GuildMember, Message, MessageFlags } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../../types/bot_classes';
import { getLavalinkPlayer, commandToLavaData } from '../../../utils/lavalink';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "stop",
        description: "Ping pong!",
        async execute(execute: ChatCommandExecute) {
            try {
                const player = getLavalinkPlayer(commandToLavaData(execute));
                if (!execute.data.member) {execute.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (execute.data.member as GuildMember).voice.channelId;
    
                if (!player) {execute.data.reply("I couldn't get what vc you're in!"); return;}
                if (player.voiceChannelId !== vcId) {execute.data.reply("You need to be in my vc!"); return;}
    
                if (player.playing) await player.destroy("stopRequest");
    
                // Only reply if its a interaction to prevent the error message
                if (!execute.isMessage) {await (execute.data as ChatInputCommandInteraction).reply({ content: "Stopped playing!", flags: MessageFlags.Ephemeral });}
            }
            catch (e) {
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
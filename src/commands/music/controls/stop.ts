import { ChatInputCommandInteraction, GuildMember, Message, MessageFlags } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../../types/bot_classes';
import { getLavalinkPlayer, commandToLavaData } from '../../../utils/lavalink';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "stop",
        description: "All done?",
        aliases: ["st"],
        category: "music",
        async execute(command: ChatCommandExecute) {
            try {
                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;
    
                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}
    
                if (player.playing) await player.destroy("stopRequest");
    
                // Only reply if its a interaction to prevent the error message
                if (!command.isMessage) {await (command.data as ChatInputCommandInteraction).reply({ content: "Stopped playing!", flags: MessageFlags.Ephemeral });}
            }
            catch (e) {
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
import { EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "vaporwave",
        description: "Slowwwwwww...",
        category: "music (filters)",
        usage: "Makes the song slower and lowers the pitch.",
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
            const vcId = (command.data.member as GuildMember).voice.channelId;
        
            if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
            if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

            await player.filterManager.toggleVaporwave();

            const embed = new EmbedBuilder();
            embed.setTitle(player.filterManager.filters.vaporwave ? "Vaporwave filter enabled" : "Vaporwave filter disabled");
            embed.setColor(player.filterManager.filters.vaporwave ? "Green" : "Red");
            embed.setFooter({ text: "it might take a second to apply/remove the filter" });

            await command.data.reply({ embeds: [embed] });
        },
    } as ChatCommandOptions
);

export default textcommand;
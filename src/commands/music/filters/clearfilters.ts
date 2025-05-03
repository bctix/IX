import { EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "clearfilters",
        description: "bye bye",
        category: "music (filters)",
        aliases: ["cf", "clearfilter"],
        usage: "Removes all filters.",
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
            const vcId = (command.data.member as GuildMember).voice.channelId;
        
            if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
            if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

            await player.filterManager.resetFilters();

            const embed = new EmbedBuilder();
            embed.setTitle("Removed all filters");
            embed.setColor("Green");
            embed.setFooter({ text: "it might take a second to remove the filter(s)" });

            await command.data.reply({ embeds: [embed] });
        },
    } as ChatCommandOptions
);

export default textcommand;
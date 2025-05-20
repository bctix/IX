import { ApplicationCommandOptionType, EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "speed",
        description: "Woaaahhhh...",
        category: "music (filters)",
        options: [
            {
                name: "rate",
                description: "Rate of song (1.0 is normal speed)",
                type: ApplicationCommandOptionType.Number,
                required: true,
                default: 1.0,
            }
        ],
        aliases: ["spe"],
        usage: "Set a custom speed for the song. (Without changing the pitch)",
        argParser(str) {
            const rate = parseFloat(str);
            if (isNaN(rate) || rate <= 0) {
                return [-1];
            }
            return [rate];
        },
        async execute(command: ChatCommandExecute) {
            const rate = command.args[0];
            
            if (rate < 0) { command.data.reply("Please provide a valid speed (greater than 0)"); return; }

            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
            const vcId = (command.data.member as GuildMember).voice.channelId;
        
            if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
            if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

            await player.filterManager.setSpeed(rate);

            const embed = new EmbedBuilder();
            embed.setTitle("Setting speed to "+rate+"x");
            embed.setColor("Green");
            embed.setFooter({ text: "it might take a second to apply/remove the filter" });

            await command.data.reply({ embeds: [embed] });
        },
    } as ChatCommandOptions
);

export default textcommand;
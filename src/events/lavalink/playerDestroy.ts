import { Colors, EmbedBuilder } from "discord.js";
import { CustomClient } from "../../types/bot_types";
import { Player } from "lavalink-client";
import { printLine } from "../../utils/utils";

export default {
    name: "playerDestroy",
    async execute(Client: CustomClient, player: Player, reason: string) {
        if (!player.textChannelId) return;

        printLine(`{red Player in guildID} {underline.red ${player.guildId}} {red was destroyed with reason:} {underline.red ${reason}}`);

        const channel = Client.channels.cache.get(player.textChannelId);

        const embed = new EmbedBuilder();

        switch (reason) {
            case "stopRequest":
                embed.setTitle("Leaving VC");
                embed.setDescription("See-ya!");
                embed.setColor(Colors.Red);
                break;
            case "QueueEmpty":
                embed.setTitle("Leaving VC");
                embed.setDescription("I wasn't playing anything for a while.");
                embed.setColor(Colors.Red);
                break;
            case "Disconnected":
                embed.setTitle("Disconnected!");
                embed.setDescription("I was disconnected from the vc!");
                embed.setColor(Colors.Red);
                break;
            case "sigint":
                break;
            case "EmptyVc":
                embed.setTitle("Leaving VC");
                embed.setDescription("I was left alone in the vc!");
                embed.setColor(Colors.Red);
                break;
            default:
                embed.setTitle("Leaving VC");
                embed.setDescription("Something happened to make me leave vc!");
                embed.setColor(Colors.Red);
                printLine(`{bold.red Unknown player destroy reason: } {underline.red ${reason}`);
                break;
        }

        if (channel && channel.isSendable()) {
            channel.send({ embeds: [embed] });
        }
    },
};
import { EmbedBuilder, SendableChannels } from "discord.js";
import { CustomClient } from "../../types/bot_classes";

export default {
    name: "SIGINT",
    async execute(Client: CustomClient) {
        if(!Client.isShuttingdown) Client.isShuttingdown = true;
        else return;
        for(const player of Client.lavalink.players.values()) {
            if(player.textChannelId !== null)
            {
                const channel = Client.channels.cache.get(player.textChannelId);
                if(channel?.isSendable()) {
                    const embed = new EmbedBuilder();
                    embed.setTitle("Leaving VC!");
                    embed.setDescription("Either something went really wrong, or IX is updating!");

                    await (channel as SendableChannels).send({embeds: [embed]});
                }
            }
            await player.destroy("sigint", true);
        }
        
        
        process.exit(0);
    },
};
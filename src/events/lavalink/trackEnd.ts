import { VoiceBasedChannel } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { Player } from "lavalink-client";

/* 
    An extra check for if the VC is empty, if so, leave the VC.
*/

export default {
    name: "trackEnd",
    async execute(Client: CustomClient, player: Player) {
        if (!player.voiceChannelId) return;
        const voiceChannel = Client.channels.cache.get(player.voiceChannelId) as VoiceBasedChannel;
        let memberCount = 0;
        for (const [, value] of voiceChannel.members) {
            if (!value.user.bot) {
                memberCount++;
            }
        }

        if (memberCount === 0) {
            player.destroy("EmptyVc");
            return;
        }
    },
};

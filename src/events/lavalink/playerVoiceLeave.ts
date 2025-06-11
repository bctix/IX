import { Player } from "lavalink-client/dist/types";
import { CustomClient } from "../../types/bot_types";
import { VoiceChannel } from "discord.js";


export default {
    name: "playerVoiceLeave",
    async execute(Client: CustomClient, player: Player) {
        if (!player.voiceChannelId) return;

        const voiceChannel = Client.channels.cache.get(player.voiceChannelId) as VoiceChannel;

        if (checkEmptyVc(voiceChannel)) {
            await player.destroy("EmptyVc");
            return;
        }
    },
};

function checkEmptyVc(vc: VoiceChannel) {
    // Get channel count WITHOUT bots
    let oldChannelCount = 0;
    for (const [, value] of vc.members) {
        if (!value.user.bot) {
            oldChannelCount++;
        }
    }

    return oldChannelCount === 0;
}
import { Events } from "discord.js";
import { CustomClient } from "../../types/bot_types";
import { VoicePacket, VoiceServer, ChannelDeletePacket } from "lavalink-client/dist/types";

export default {
    name: Events.Raw,
    async execute(Client: CustomClient, d: VoicePacket | VoiceServer | ChannelDeletePacket) {
        if (Client.lavalink) {Client.lavalink.sendRawData(d);}
    },
};
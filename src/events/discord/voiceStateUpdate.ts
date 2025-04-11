import { Events, VoiceChannel, VoiceState } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { getLavalinkPlayer } from "../../utils/lavalink";

export default {
	name: Events.VoiceStateUpdate,
	async execute(Client: CustomClient, oldState: VoiceState) {

		if (!Client.lavalink || !oldState.channel) return;

		const guildId = oldState.guild.id;
		if (!guildId) return;
		
		const player = getLavalinkPlayer({ voiceChannel: oldState, client: Client, }, false);

		if (!player) return;
		if (!player.voiceChannelId) return;
		if (player.voiceChannelId !== oldState.channelId) return;

		if (checkEmptyVc(oldState)) {
			if (oldState.channel.members.size <= 1) {
				player.destroy("EmptyVc");
				return;
			}
		}
	},
};

function checkEmptyVc(oldState: VoiceState) {
	const oldChannel = oldState.channel as VoiceChannel;

	// Get channel count WITHOUT bots
	let oldChannelCount = 0;
	for (const [, value] of oldChannel.members) {
		if (!value.user.bot) {
			oldChannelCount++;
		}
	}

	if (oldChannelCount === 0) {
		return true;
	}
	return false;
}
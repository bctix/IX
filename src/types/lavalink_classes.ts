import { APIUser, User, VoiceState } from "discord.js";
import { CustomClient } from "./bot_classes";

export interface LavaData {
	voiceChannel: VoiceState;
	textChannelId?: string;
	requestor?: User|APIUser;
	client: CustomClient;
}
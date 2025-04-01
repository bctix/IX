import { GuildMember } from "discord.js";
import { LavaData } from "../types/lavalink_classes";
import { ChatCommandExecute, CustomClient } from "../types/bot_classes";
import { LavalinkManager, Player } from "lavalink-client";
import { registerEvents } from "./registry";

export async function initLavalink(client: CustomClient) {
	if (!process.env.LAVALINK_PASSWORD || !process.env.LAVALINK_HOST || !process.env.LAVALINK_PORT) {
		console.error("Failed to get all lavalink server data. Not creating lavalink.");
		return;
	}
	if (!client.user || !client.user.id) {
		console.error("The bot is not started! Start the bot first.");
		return;
	}

	const lavalink = new LavalinkManager({
		nodes: [
			{
				authorization: process.env.LAVALINK_PASSWORD,
				host: process.env.LAVALINK_HOST,
				port: parseInt(process.env.LAVALINK_PORT),
                id: "ixNode",
                requestSignalTimeoutMS: 10_000
			},
		],
		sendToShard: (guildId: string, payload: unknown) =>
			client.guilds.cache.get(guildId)?.shard?.send(payload),
		client: {
			id: client.user.id,
			username: client.user.username,
		},
		emitNewSongsOnly: true,
		playerOptions: {
			onEmptyQueue: {
				destroyAfterMs: 120_000,
			},
		},
		queueOptions: {
			maxPreviousTracks: 10,
		},
		linksBlacklist: ["porn"],
	});

	await registerEvents(lavalink, client, "../events/lavalink");

	await lavalink.init({
		id: client.user.id,
		username: client.user.username,
	});

	client.lavalink = lavalink;

	console.log("Started lavalink!");
}

export function commandToLavaData(command: ChatCommandExecute) : LavaData {
	if (!command.data.member) {
		throw new Error("Something went wrong trying to get voice data!");
	}

	const vc = (command.data.member as GuildMember).voice;

	return {
		voiceChannel: vc,
		textChannelId: command.data.channelId,
		requestor: command.data.member.user,
		client: command.client,
	};
}

export function getLavalinkPlayer(lavadata: LavaData) : Player {
	const vc = lavadata.voiceChannel.channel;
	if (!vc) throw new Error("You need to be in a VC! (or i dont have access to it!)");
	if (!vc.joinable) throw new Error("I cannot join your vc!");

	const player =
    lavadata.client.lavalink.getPlayer(vc.guildId) || (
    	lavadata.client.lavalink.createPlayer({
    		guildId: vc.guildId,
    		voiceChannelId: (lavadata.voiceChannel.channelId as string),
    		textChannelId: lavadata.textChannelId,
    		selfDeaf: true,
    		selfMute: false,
    		volume: 50,
    	})
    );

	return player;
}

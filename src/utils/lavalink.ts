import { LavalinkManager, LavalinkNodeOptions, Player, SearchPlatform } from "lavalink-client";
import { LavalinkConfig, CustomClient, ChatCommandExecute, LavaData } from "../types/bot_types";
import { registerEvents } from "./registry";
import { ButtonBuilder, ButtonStyle, Colors, ContainerBuilder, GuildMember, hyperlink, MessageFlags, SectionBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { createErrorEmbed, getVibrantColorToDiscord, printLine } from "./utils";

export async function createLavalinkManager(client: CustomClient, options: LavalinkConfig): Promise<LavalinkManager> {
    if (!options) throw new Error("Lavalink configuration is required");

    if (!client.user || !client.user.id) throw new Error("Client user is not logged in.");

    const nodes: LavalinkNodeOptions[] = [];

    for (const node of options.nodes) {
        if (!node.host || !node.port || !node.password || !node.id) {
            throw new Error(`Invalid Lavalink node configuration: ${JSON.stringify(node)}`);
        }

        nodes.push({
            host: node.host,
            port: node.port,
            authorization: node.password,
            id: node.id,
            requestSignalTimeoutMS: node.signalTimeout || 10000,
        });
    }

    const lavalink = new LavalinkManager({
        nodes: nodes,
        sendToShard: (guildId: string, payload: unknown) => client.guilds.cache.get(guildId)?.shard?.send(payload),
        client: {
            id: client.user.id,
            username: client.user.username,
        },
        emitNewSongsOnly: true,
        playerOptions: {
            onEmptyQueue: {
                destroyAfterMs: options.timeTillLeaveWhenEmpty || 120_000,
            },
        },
        queueOptions: {
            maxPreviousTracks: 10,
        },
    });

    await registerEvents(lavalink, client, "../events/lavalink");

    await lavalink.init({
        id: client.user.id,
        username: client.user.username,
    });

    return lavalink;
}

export async function playSong(command: ChatCommandExecute, url: string, platform: SearchPlatform) {
    try {
        if (!url || url === "") {
            await command.data.reply("You need to search for a song!");
            return;
        }

        const player = getLavalinkPlayer(commandToLavaData(command));

        if (!player) {
            await command.data.reply({ embeds: [createErrorEmbed("I couldn't find a vc you are in!")] });
            return;
        }

        const searchRes = await player.search({ query: url, source: platform }, command.data.member?.user);

        if (!searchRes || !searchRes.tracks?.length) {
            await command.data.reply("Couldn't find any songs!");
            return;
        }

        await player.queue.add(
            searchRes.loadType === "playlist" ? searchRes.tracks : searchRes.tracks[0],
        );

        const wasPlaying = player.connected;

        if (!player.connected) await player.connect();
        if (!player.playing) await player.play();

        if (wasPlaying) {
            const container = new ContainerBuilder();

            switch (searchRes.loadType) {
                case "playlist": {
                    const textDisplay = new TextDisplayBuilder().setContent(`### Adding playlist to queue\n### ${hyperlink(searchRes.playlist?.name ?? "Unknown Playlist", searchRes.playlist?.uri ?? "")}`);

                    if (searchRes.playlist?.thumbnail) {
                        const section = new SectionBuilder();
                        section.addTextDisplayComponents(textDisplay);
                        const thumbnail = new ThumbnailBuilder().setURL(searchRes.playlist.thumbnail);
                        section.setThumbnailAccessory(thumbnail);
                        const col = await getVibrantColorToDiscord(searchRes.playlist.thumbnail);
                        if (col) container.setAccentColor(col);
                        container.addSectionComponents(section);
                    }
                    else {
                        console.log("Not adding thumbnail");
                        container.addTextDisplayComponents(textDisplay);
                        container.setAccentColor(Colors.Green);
                    }
                    break;
                }

                case "search": {
                    const textDisplay = new TextDisplayBuilder().setContent(`### Added song to queue\n### ${hyperlink(searchRes.tracks[0].info.title, searchRes.tracks[0].info.uri ?? "")}`);

                    if (searchRes.tracks[0].info.artworkUrl) {
                        const section = new SectionBuilder();
                        section.addTextDisplayComponents(textDisplay);
                        const thumbnail = new ThumbnailBuilder().setURL(searchRes.tracks[0].info.artworkUrl);
                        section.setThumbnailAccessory(thumbnail);
                        const col = await getVibrantColorToDiscord(searchRes.tracks[0].info.artworkUrl);
                        if (col) container.setAccentColor(col);
                        container.addSectionComponents(section);
                    }
                    else {
                        console.log("Not adding thumbnail");
                        container.addTextDisplayComponents(textDisplay);
                        container.setAccentColor(Colors.Green);
                    }
                    break;
                }
                default: {
                    container.addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`### Added song to queue\n### ${hyperlink(searchRes.tracks[0].info.title, searchRes.tracks[0].info.uri ?? "")}`),
                    );
                }
            }

            container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

            const playButton = new ButtonBuilder()
                .setLabel("Play now")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("play")
                .setEmoji("⏭️");

            if (searchRes.loadType !== "playlist") container.addActionRowComponents(row => row.addComponents(playButton));

            const message = await command.data.reply({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });

            const collector = message.createMessageComponentCollector({ filter: (i) => i.user.id === command.data.member?.user.id, time: 60_000 });

            collector.on("collect", async (i) => {
                if (!player) {
                    playButton.setDisabled(true);
                    await i.update({ components: [container] });
                    return;
                }

                if (i.customId === "play") {
                    const trackIdx = player.queue.tracks.indexOf(searchRes.tracks[0]);
                    const removeTrack = await player.queue.remove(trackIdx);
                    if (removeTrack != null) {
                        const removedTrack = removeTrack.removed[0];
                        await player.queue.add(removedTrack, 0);
                        await player.skip();
                    }
                    await message.delete();
                }
            });
        }
    }
    catch (error) {
        printLine(`{red Error while trying to play song:} ${error}`);
        command.data.reply({ embeds: [createErrorEmbed((error as Error).message)] });
        return;
    }
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

export function getLavalinkPlayer(lavadata: LavaData, createPlayer = true) : Player | undefined {
    const vc = lavadata.voiceChannel.channel;
    if (!vc) throw new Error("You need to be in a VC! (or i dont have access to it!)");
    if (!vc.joinable) throw new Error("I cannot join your vc!");

    const player = lavadata.client.lavalink.getPlayer(vc.guildId);
    if (!player && createPlayer) {
        return lavadata.client.lavalink.createPlayer({
            guildId: vc.guildId,
            voiceChannelId: (lavadata.voiceChannel.channelId as string),
            textChannelId: lavadata.textChannelId,
            selfDeaf: true,
            selfMute: false,
            volume: 50,
        });
    }

    return player;
}

export function checkPlayer(command:ChatCommandExecute, player: Player | undefined): boolean {
    if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return false;};
    const vcId = (command.data.member as GuildMember).voice.channelId;

    if (!player) {command.data.reply("I couldn't get what vc you're in!"); return false;}
    if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return false;}

    return true;
}
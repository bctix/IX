import { Player, Track } from "lavalink-client";
import { CustomClient } from "../../types/bot_types";
import { ButtonBuilder, ButtonStyle, Colors, ContainerBuilder, GuildMember, hyperlink, MessageFlags, SectionBuilder, SendableChannels, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder, User } from "discord.js";
import { getVibrantColorToDiscord, msToTime } from "../../utils/utils";

export default {
    name: "trackStart",
    async execute(client: CustomClient, player: Player, track: Track) {
        if (!player.textChannelId) return;
        const guild = client.guilds.cache.get(player.guildId);
        const channel = client.channels.cache.get(player.textChannelId);
        const member = guild?.members.cache.get((track.requester as User).id);

        if (!channel) return;

        const container = new ContainerBuilder();

        const section = new SectionBuilder();
        section.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`### Now playing song:\n### ${hyperlink(track.info.title, track.info.uri ?? "")}`),
        );
        if (track.info.artworkUrl) {
            const thumbnail = new ThumbnailBuilder().setURL(track.info.artworkUrl);
            section.setThumbnailAccessory(thumbnail);
            const col = await getVibrantColorToDiscord(track.info.artworkUrl);
            if (col) container.setAccentColor(col);
        }
        else {
            container.setAccentColor(Colors.Green);
        }

        container.addSectionComponents(section);

        container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

        const middleText = new TextDisplayBuilder().setContent(
            [
                `**Duration**:\n${track.info.isStream ? "Live" : msToTime(track.info.duration)}\n`,
                `**Author**:\n${track.info.author}\n`,
                `-# Requested by: ${member?.nickname ?? member?.displayName ?? (track.requester as User).displayName ?? (track.requester as User).username}`,
            ].join("\n"),
        );

        container.addTextDisplayComponents(middleText);
        container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

        const skipButton = new ButtonBuilder()
            .setLabel("Skip")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("skip")
            .setEmoji("⏭️");

        const toggleLoop = new ButtonBuilder()
            .setLabel(`Toggle loop (${player.repeatMode})`)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("toggleLoop");

        if (player.queue.tracks.length === 0) skipButton.setDisabled(true);

        container.addActionRowComponents(row => row.addComponents(skipButton, toggleLoop));

        if (channel && channel.isSendable()) {
            const res = await (channel as SendableChannels).send({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });


            const collector = res.createMessageComponentCollector({ filter: i => i.user.id === (track.requester as User).id, time: 120_000 });

            collector.on("collect", async (i) => {

                if (!player) {
                    skipButton.setDisabled(true);
                    toggleLoop.setDisabled(true);
                    await i.update({ components: [container] });
                    return;
                }

                if ((i.member as GuildMember).voice.channelId !== player.voiceChannelId) {
                    await i.update({ components: [container] });
                    return;
                }

                if (i.customId === "skip") {
                    if (player.queue.tracks.length > 0) await player.skip();
                    collector.stop();
                    await res.delete();
                    return;
                }

                if (i.customId === "toggleLoop") {
                    switch (player.repeatMode) {
                        case "off":
                            await player.setRepeatMode("track");
                            toggleLoop.setLabel(`Toggle loop (${player.repeatMode})`).setStyle(ButtonStyle.Success);
                            break;
                        case "track":
                            await player.setRepeatMode("queue");
                            toggleLoop.setLabel(`Toggle loop (${player.repeatMode})`).setStyle(ButtonStyle.Success);
                            break;
                        case "queue":
                            await player.setRepeatMode("off");
                            toggleLoop.setLabel(`Toggle loop (${player.repeatMode})`).setStyle(ButtonStyle.Secondary);
                            break;
                    }
                }

                await i.update({ components: [container] });
            });
        }
    },
};
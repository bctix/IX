import { ContainerBuilder, TextDisplayBuilder, hyperlink, SectionBuilder, ThumbnailBuilder, Colors, User, userMention, ButtonBuilder, ButtonStyle, SeparatorSpacingSize, MessageFlags } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";
import { generateProgressBar, getVibrantColorToDiscord, msToTime } from "../../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "nowplaying",
        description: "whar?",
        category: "music (info)",
        aliases: ["np"],
        usage: "Display extra info about the current song.",
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            const track = player.queue.current;

            if (!track) { command.data.reply("There is no song playing!"); return; }

            const container = new ContainerBuilder();
            const textDisplay = new TextDisplayBuilder().setContent(`### Now playing song:\n### ${hyperlink(track.info.title, track.info.uri ?? "")}`);

            if (track.info.artworkUrl) {
                const section = new SectionBuilder();
                const thumbnail = new ThumbnailBuilder().setURL(track.info.artworkUrl);
                section.setThumbnailAccessory(thumbnail);
                section.addTextDisplayComponents(
                    textDisplay,
                );
                const col = await getVibrantColorToDiscord(track.info.artworkUrl);
                if (col) container.setAccentColor(col);
                container.addSectionComponents(section);
            }
            else {
                container.setAccentColor(Colors.Green);
                container.addTextDisplayComponents(textDisplay);
            }

            const guild = command.client.guilds.cache.get(player.guildId);
            const member = guild?.members.cache.get((track.requester as User).id);

            const middleText = new TextDisplayBuilder().setContent(
                [
                    `**Duration**:\n${track.info.isStream ? "Live" : msToTime(track.info.duration)}`,
                    `**Source**:\n${track.info.sourceName}\n`,
                    `\`${msToTime(player.position)}\` - ${generateProgressBar(player.position / track.info.duration)} - \`${msToTime(track.info.duration)}\`\n`,
                    `-# Requested by: ${member?.nickname ?? member?.displayName ?? (track.requester as User).displayName ?? (track.requester as User).username}`,
                ].join("\n"),
            );

            container.addTextDisplayComponents(middleText);
            container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

            const backButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji("⏮️")
                .setCustomId("back");

            const pauseButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(player.paused ? "▶️" : "⏸️")
                .setCustomId("pause");

            const forwardButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji("⏭️")
                .setCustomId("forward");

            const toggleLoop = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Toggle loop (${player.repeatMode})`)
                .setCustomId("toggleLoop");

            container.addActionRowComponents(row => row.addComponents(backButton, pauseButton, forwardButton, toggleLoop));

            const message = await command.data.reply({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });

            const collector = message.createMessageComponentCollector({ filter: i => i.user.id === (track.requester as User).id, time: 240_000 });

            collector.on("collect", async (i) => {
                if (!player) {
                    backButton.setDisabled(true);
                    pauseButton.setDisabled(true);
                    forwardButton.setDisabled(true);
                    toggleLoop.setDisabled(true);
                    await i.update({ components: [container] });
                    return;
                }

                if (i.user.id !== (track.requester as User).id) {
                    return;
                }

                switch (i.customId) {
                    case "back": {
                        // TODO: Implement back to go to tracks in the previous queue.
                        await player.seek(0);
                        break;
                    }
                    case "pause": {
                        if (player.paused) {
                            await player.resume();
                            pauseButton.setEmoji("⏸️");
                        }
                        else {
                            await player.pause();
                            pauseButton.setEmoji("▶️");
                        }
                        break;
                    }
                    case "forward": {
                        if (player.queue.tracks.length > 0) await player.skip();
                        break;
                    }
                    case "toggleLoop": {
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
                        break;
                    }
                }

                await i.update({ components: [container] });
            });
        },
    } as ChatCommandOptions,
);

export default textcommand;
import { ButtonBuilder, ButtonStyle, Colors, ContainerBuilder, GuildMember, hyperlink, MessageFlags, SectionBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder, User, userMention } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";
import { generateProgressBar, getVibrantColorToDiscord, msToTime } from "../../../utils/utils";
import { Track } from "lavalink-client/dist/types";

async function buildTopPart(track: Track, container: ContainerBuilder) {

    if (track.info.artworkUrl) {
        const topSection = new SectionBuilder();
        const topTitle = new TextDisplayBuilder().setContent(
            [
                "### Current song:",
                `### ${hyperlink(`${track.info.title}`, track.info.uri)}`,
                `${hyperlink(`- ${track.info.author}`, track.info.uri)}`,
            ].join("\n")
        );

        topSection.addTextDisplayComponents(topTitle);

        if (track.info.artworkUrl) {
            const col = await getVibrantColorToDiscord(track.info.artworkUrl);
            if (col)
                container.setAccentColor(col);

            const thumbnail = new ThumbnailBuilder().setURL(track.info.artworkUrl);
            topSection.setThumbnailAccessory(thumbnail);
        } else {
            container.setAccentColor(Colors.Green);
        }
        container.addSectionComponents(topSection);
        container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));
    } else {
        const topTitle = new TextDisplayBuilder().setContent(
			[
				"### Now playing song",
				`### ${hyperlink(`${track.info.title}`, track.info.uri)}`,
				`${hyperlink(`- ${track.info.author}`, track.info.uri)}`,
			].join("\n")
		);

		container.addTextDisplayComponents(topTitle);
    }
}

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "nowplaying",
        description: "whar?",
        category: "music (info)",
        aliases: ["np"],
        usage: "Display extra info about the current song.",
        async execute(command: ChatCommandExecute) {
            try {
                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;
    
                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;};
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;};
    
                const track = player.queue.current;
    
                if (!track) {command.data.reply("You are not playing anything!"); return;};

                const container = new ContainerBuilder();
                
                await buildTopPart(track, container);

                const middleText = new TextDisplayBuilder().setContent(
                    [
                        `**Duration**:\n${track.info.isStream ? "Live" : msToTime(track.info.duration)}`,
                        `**Source**:\n${track.info.sourceName}\n`,
                        `\`${msToTime(player.position)}\` - ${generateProgressBar(player.position / track.info.duration)} - \`${msToTime(track.info.duration)}\`\n`,
                        `-# Requested by: ${userMention((track.requester as User).id)}`
                    ].join("\n")
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
                    .setLabel("Toggle loop")
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
                            } else {
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
                                    toggleLoop.setLabel("Looping track").setStyle(ButtonStyle.Success);
                                    break;
                                case "track":
                                    await player.setRepeatMode("queue");
                                    toggleLoop.setLabel("Looping queue").setStyle(ButtonStyle.Success);
                                    break;
                                case "queue":
                                    await player.setRepeatMode("off");
                                    toggleLoop.setLabel("Looping off").setStyle(ButtonStyle.Secondary);
                                    break;
                            }
                            break;
                        }
                    }

                    await i.update({ components: [container] });
                });
            } catch (e) {
                command.data.reply("Something went wrong!");
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
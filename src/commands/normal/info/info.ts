import { ContainerBuilder, EmbedBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_types";
import { prefix, version } from "../../../utils/constants";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "info",
        description: "imform",
        usage: "Sends information about the bot.",
        category: "info",
        async execute(execute: ChatCommandExecute) {
            const container = new ContainerBuilder();
            container.addSectionComponents(section => section.addTextDisplayComponents(new TextDisplayBuilder({
                content: [
                    "# IX",
                    "### your favorite music bot"
                ].join("\n"),
            })).setThumbnailAccessory(new ThumbnailBuilder({
                description: 'some text',
                media: {
                    url: execute.client.user?.displayAvatarURL() ?? "https://github.com/bctix/IX/blob/main/assets/images/IX.png?raw=true",
                },
            })));
            container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Large));
            container.addTextDisplayComponents(new TextDisplayBuilder({
                content: [
                    "IX is a discord bot with a focus on music. Using Lavalink and the latest features from discord like Components V2",
                    "She can play music from Youtube, Spotify, Soundcloud, Apple Music, Bandcamp, and much more."
                ].join("\n"),
            }));
            container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Large));
            container.addTextDisplayComponents(new TextDisplayBuilder({
                content: [
                    "**Created by:**\nbct",
                    `**Version:**\n${version}`
                ].join("\n"),
            }));
            container.setAccentColor([10, 10, 10]);


            execute.data.reply({
                flags: MessageFlags.IsComponentsV2,
                components: [container] });
        },
    } as ChatCommandOptions,
);

export default textcommand;
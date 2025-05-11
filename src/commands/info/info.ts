import { ContainerBuilder, MessageFlags, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_classes";
import { author, version } from "../../utils/constants";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "info",
        description: "Who are you?",
        category: "info",
        usage: "Sends information all about IX.",
        argParser(str) {
            return [str];
        },
        async execute(execute: ChatCommandExecute) {
            const container = new ContainerBuilder();
            container.setAccentColor([0,0,0]);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
                [
                    "# IX",
                    "## Your favorite music bot :)",
                    "IX is a discord bot with a focus on music. Using Lavalink and the latest features from discord like Components V2",
                    "She can play music from Youtube, Spotify, Soundcloud, Apple Music, Bandcamp, and much more."
                ].join("\n")
            ));

            container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Large));

            const lavalinkInfo = await execute.client.lavalink.nodeManager.nodes.get("ixNode")?.fetchInfo();

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
                [
                    "## Info",
                    `**IX Version**: ${version}`,
                    `**Created by**: ${author}`,
                    // I could use fetchVersion(), but I plan on adding other lavalink info at a later date.
                    `**Lavalink Version**: ${lavalinkInfo?.version.major}.${lavalinkInfo?.version.minor}.${lavalinkInfo?.version.patch}`,
                ].join("\n")
            ));

            execute.data.reply(
                {
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                }
            );
        },
    } as ChatCommandOptions
);

export default textcommand;
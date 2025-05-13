import { ContainerBuilder, MessageFlags, SeparatorSpacingSize, Team, TextDisplayBuilder } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_classes";
import osu from "node-os-utils";
import { msToTime } from "../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "devinfo",
        description: "devs only!",
        category: "info",
        usage: "Sends more detailed information.",
        devOnly: true,
        argParser(str) {
            return [str];
        },
        async execute(execute: ChatCommandExecute) {
            const container = new ContainerBuilder();
            container.setAccentColor([0,0,0]);

            const cpu = osu.cpu;
            const mem = osu.mem;
            const os = osu.os;

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
                [
                    "# Server Stats",
                    "## Info",
                    `**Platform:** ${os.platform()}`,
                    `**Arch:** ${os.arch()}`,
                    `**Type:** ${os.type()}`,
                    `**Uptime:** ${msToTime(os.uptime())}`,
                    "## CPU",
                    `**CPU Usage:** ${await cpu.usage()}`,
                    `**CPU Free:** ${await cpu.free()}`,
                    `**CPU Cores:** ${cpu.count()}`,
                    "## Memory",
                    `**Memory Free:** ${(await mem.free()).freeMemMb}`,
                    `**Memory Used:** ${(await mem.used()).usedMemMb}`,
                    `**Memory Total:** ${mem.totalMem()}`,
                ].join("\n")
            ));

            container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Large));

            const lavalink = execute.client.lavalink;
            const mainNode = lavalink.nodeManager.nodes.get("ixNode");
            const nodeStats = await mainNode?.fetchStats();

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
                [
                    "# Lavalink Stats",
                    "## Main Node",
                    `**CPU:** ${nodeStats?.cpu.lavalinkLoad}`,
                    `**Memory:** ${nodeStats?.memory.used}`,
                    `**Players:** ${nodeStats?.players}`,
                    `**Uptime:** ${nodeStats?.uptime}`,
                ].join("\n")
            ));

            container.addSeparatorComponents(sep => sep.setSpacing(SeparatorSpacingSize.Large));

            const client = execute.client;
            const application = await client.application?.fetch();

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
                [
                    "# Bot Stats",
                    "## General Info",
                    `**Command Count:** ${client.chatcommands.filter(command => !command.isAlias).size}`,
                    `**Guilds:** ${client.guilds.cache.size}`,
                    `**Uptime:** ${client.uptime ? msToTime(client.uptime) : "Unknown"}`,
                    "## Application Info",
                    `**Team:** ${(application?.owner as Team).name}`,
                    `**Aprox. User Install:** ${application?.approximateUserInstallCount}`,
                    `**Aprox. Guild Count:** ${application?.approximateGuildCount}`,
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
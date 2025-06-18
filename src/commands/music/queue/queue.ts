import { ApplicationCommandOptionType, ContainerBuilder, hyperlink, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";
import { msToTime } from "../../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "queue",
        description: "forgor?",
        aliases: ["q"],
        options: [
            {
                name: "page",
                description: "Page in the queue to view.",
                type: ApplicationCommandOptionType.Integer,
                default: 0,
                required: false,
            },
        ],
        category: "music (queue)",
        usage: "Displays the current queue for the server.",
        argParser(str: string) {
            const page = Math.round(parseInt(str));
            return [isNaN(page) ? 1 : page];
        },
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            const desiredPage = command.args[0];

            const slicedQueue = player.queue.tracks.slice((desiredPage - 1) * 10, desiredPage * 10);

            let queueStr = "";
            let queueLength = 0;

            slicedQueue.forEach(track => {
                queueStr += `${player.queue.tracks.indexOf(track) + 1}. ${track.info.uri ? hyperlink(track.info.title, track.info.uri) : track.info.title} - ${track.info.author ?? "Unknown"}\n`;

                if (track.info.duration) queueLength += track.info.duration;
            });

            if (queueStr === "") queueStr = "Empty";

            const container = new ContainerBuilder();

            container.addTextDisplayComponents(new TextDisplayBuilder({ content: "## Queue:" }));
            container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }));
            container.addTextDisplayComponents(new TextDisplayBuilder({ content: queueStr }));
            container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }));
            container.addTextDisplayComponents(new TextDisplayBuilder({ content: `Page ${desiredPage}/${Math.ceil(player.queue.tracks.length / 10)} | Queue Length: ${msToTime(queueLength)}` }));
            container.setAccentColor([10, 10, 10]);

            await command.data.reply({
                flags: MessageFlags.IsComponentsV2,
                components: [container],
            });
        },
    } as ChatCommandOptions,
);

export default textcommand;
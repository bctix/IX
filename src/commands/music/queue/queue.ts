import { ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ContainerBuilder, GuildMember, hyperlink, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";
import { msToTime } from "../../../utils/utils";
import { Player } from "lavalink-client/dist/types";

interface QueueData {
    queueString: string,
    queueLength: number,
}

function generateQueueData(player: Player, page: number): QueueData {
    const slicedQueue = player.queue.tracks.slice((page - 1) * 10, page * 10);

    let queueStr = "";
    let queueLength = 0;

    slicedQueue.forEach(track => {
        queueStr += `${player.queue.tracks.indexOf(track) + 1}. ${track.info.uri ? hyperlink(track.info.title, track.info.uri) : track.info.title} - ${track.info.author ?? "Unknown"}\n`;
    });

    player.queue.tracks.forEach(track => {
        if (track.info.duration) queueLength += track.info.duration;
    });

    if (queueStr === "") queueStr = "Empty";

    return {
        queueLength: queueLength,
        queueString: queueStr,
    };
}


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

            let curPage = desiredPage;

            const queueData = generateQueueData(player, desiredPage);

            let container = new ContainerBuilder();

            container.addTextDisplayComponents(new TextDisplayBuilder({ content: "## Queue:" }));
            container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }));
            container.addTextDisplayComponents(new TextDisplayBuilder({ content: queueData.queueString }));
            container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }));
            container.addTextDisplayComponents(new TextDisplayBuilder({ content: `Page ${desiredPage}/${Math.ceil(player.queue.tracks.length / 10)} | Queue Length: ${msToTime(queueData.queueLength)}` }));
            container.setAccentColor([10, 10, 10]);

            const previousPage = new ButtonBuilder()
                .setLabel("Previous Page")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("previous")
                .setEmoji("⬅️");
            if (desiredPage !== 0) previousPage.setDisabled(true);

            const nextPage = new ButtonBuilder()
                .setLabel("Next Page")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("next")
                .setEmoji("➡️");
            if (desiredPage > Math.ceil(player.queue.tracks.length / 10)) nextPage.setDisabled(true);

            const shuffleButton = new ButtonBuilder()
                .setLabel("Shuffle Queue")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("shuffle")
                .setEmoji("🔀");

            container.addActionRowComponents(row => row.addComponents(previousPage, nextPage, shuffleButton));

            const res = await command.data.reply({
                flags: MessageFlags.IsComponentsV2,
                components: [container],
            });

            const collector = res.createMessageComponentCollector({ time: 120_000 });

            let shuffledCount = 0;

            collector.on("collect", async (i) => {

                if (!player) {
                    previousPage.setDisabled(true);
                    nextPage.setDisabled(true);
                    shuffleButton.setDisabled(true);
                    await i.update({ components: [container] });
                    return;
                }

                if ((i.member as GuildMember).voice.channelId !== player.voiceChannelId) {
                    await i.update({ components: [container] });
                    return;
                }

                if (i.customId === "previous") curPage--;
                if (i.customId === "next") curPage++;

                if (i.customId === "shuffle") {
                    await player.queue.shuffle();
                    shuffledCount++;
                    shuffleButton.setLabel(shuffledCount === 1 ? "Shuffled!" : `Shuffled again! (${shuffledCount}x)`);
                    shuffleButton.setStyle(ButtonStyle.Success);
                }

                const newQueueData = generateQueueData(player, curPage);

                container = new ContainerBuilder();

                container.addTextDisplayComponents(new TextDisplayBuilder({ content: "## Queue:" }));
                container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }));
                container.addTextDisplayComponents(new TextDisplayBuilder({ content: newQueueData.queueString }));
                container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }));
                container.addTextDisplayComponents(new TextDisplayBuilder({ content: `Page ${curPage}/${Math.ceil(player.queue.tracks.length / 10)} | Queue Length: ${msToTime(newQueueData.queueLength)}` }));
                container.setAccentColor([10, 10, 10]);

                previousPage.setDisabled(curPage === 1);
                nextPage.setDisabled((curPage === Math.ceil(player.queue.tracks.length / 10)));

                container.addActionRowComponents(row => row.addComponents(previousPage, nextPage, shuffleButton));
                await i.update({ components: [container] });
            });
        },
    } as ChatCommandOptions,
);

export default textcommand;
import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";
import { generateProgressBar, msToTime } from "../../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "seek",
        description: "where go?",
        aliases: ["se"],
        usage: "Move to a specific time in the current song.",
        category: "music (controls)",
        argParser(str: string) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player, true) || !player || !player.queue.current) return;

            const position = command.args[0] as string;

            // Validate the position format with HH:MM:SS or MM:SS or SS
            const regex = /^(\d{1,2}:)?(\d{1,2}:)?\d{1,2}$/;
            if (!regex.test(position)) {
                command.data.reply("Invalid time format. Please use HH:MM:SS, MM:SS, or SS.");
                return;
            }

            // https://stackoverflow.com/a/45292588
            const posSeconds = position.split(":").reduce((acc: number, time: string) => (60 * acc) + +time, 0);

            await player.seek(posSeconds * 1000);

            const bar = generateProgressBar(player.position / player.queue.current.info.duration);

            const embed = new EmbedBuilder()
                .setTitle("New position:")
                .setDescription(`\`${msToTime(player.position)}\` - ${bar} - \`${msToTime(player.queue.current.info.duration)}\``)
                .setColor("Green");

            await command.data.reply({embeds: [embed]});

        },
    } as ChatCommandOptions,
);

export default textcommand;
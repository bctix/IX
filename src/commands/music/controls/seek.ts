import { ApplicationCommandOptionType, EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";
import { generateProgressBar, msToTime } from "../../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "seek",
        description: "where go?",
        aliases: ["se"],
        options: [
            {
                name: "position",
                description: "Where to go.",
                required: true,
                default: "",
                type: ApplicationCommandOptionType.String,
            },
        ],
        category: "music (controls)",
        usage: "Move to a specific time in the current song.",
        argParser(str) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            try {
                const position = command.args[0] as string;

                // Validate the position format with HH:MM:SS or MM:SS or SS
                const regex = /^(\d{1,2}:)?(\d{1,2}:)?\d{1,2}$/;
                if (!regex.test(position)) {
                    command.data.reply("Invalid time format. Please use HH:MM:SS, MM:SS, or SS.");
                    return;
                }

                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;

                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}
                if (!player.playing || !player.queue.current) {command.data.reply("I'm not playing anything!"); return;}

                // https://stackoverflow.com/a/45292588
                const posSeconds = position.split(":").reduce((acc: number, time: string) => (60 * acc) + +time, 0);

                await player.seek(posSeconds * 1000);

                const bar = generateProgressBar(player.position / player.queue.current.info.duration);
                
                const embed = new EmbedBuilder()
                    .setTitle("New position:")
                    .setDescription(`\`${msToTime(player.position)}\` - ${bar} - \`${msToTime(player.queue.current.info.duration)}\``)
                    .setColor("Green");

                await command.data.reply({ embeds: [embed] });
            } catch (e) {
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
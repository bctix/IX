import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { getLavalinkPlayer, commandToLavaData, checkPlayer } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "remove",
        description: "Who's Steve Jobs?",
        aliases: ["rm"],
        category: "music (queue)",
        usage: "Removes the selected song from the queue.",
        options: [
            {
                name: "position",
                description: "What song to remove.",
                required: true,
                default: 1,
                type: ApplicationCommandOptionType.Integer,
            },
        ],
        argParser(str) {
            let val = Math.round(parseInt(str));
            if (isNaN(val)) val = 1;
            return [val];
        },
        execute: async function(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            const position = command.args[0] - 1;

            const removeTrack = await player.queue.remove(position);
            if (removeTrack == null) {command.data.reply("There is no song at that position in the queue!"); return;}

            const removedTrack = removeTrack.removed[0];
            if (removedTrack == null) {command.data.reply("There is no song at that position in the queue!"); return;}

            const embed = new EmbedBuilder()
                .setTitle("Removed song")
                .setDescription(`[${removedTrack.info.title}](${removedTrack.info.uri})`);
            if (removedTrack.info.artworkUrl) {embed.setThumbnail(removedTrack.info.artworkUrl);}

            await command.data.reply({ embeds:[embed] });
        },
    } as ChatCommandOptions,
);

export default textcommand;
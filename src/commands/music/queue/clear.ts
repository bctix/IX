import { EmbedBuilder } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { getLavalinkPlayer, commandToLavaData, checkPlayer } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "clear",
        description: "Begone!",
        aliases: ["cl"],
        category: "music (queue)",
        usage: "Removes all songs from the queue.",
        argParser(str) {
            return [str];
        },
        execute: async function(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            const deletedTracks = await player.queue.splice(0, player.queue.tracks.length);

            const embed = new EmbedBuilder();
            if (!deletedTracks) {
                embed.setTitle("The queue is empty!")
                    .setColor("Red");
            }
            else {
                embed.setTitle("Cleared queue!")
                    .setDescription(`Removed ${deletedTracks.length ? deletedTracks.length : 1} track${deletedTracks.length > 1 ? "s" : ""}`)
                    .setColor("Red");
            }

            await command.data.reply({ embeds:[embed] });
        },
    } as ChatCommandOptions,
);

export default textcommand;
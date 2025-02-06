const { MessageFlags } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "pause",
    description: "Don't pause!",
    category: "Music",
    aliases: ["pa"],

    execute: async function(command) {
        try {
            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");
            if(!player.playing) return command.data.reply("I'm not playing anything!");

            if(!player.paused) await player.pause();
            else return command.data.reply("I'm already paused!");

            command.data.reply("Paused song!");

        } catch(e) {
            console.log(e.message);
        }
    }
}
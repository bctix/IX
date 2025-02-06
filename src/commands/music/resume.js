const { MessageFlags } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "resume",
    description: "Press play!",
    category: "Music",
    aliases: ["rs"],

    execute: async function(command) {
        try {
            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");

            if(player.paused) await player.resume();
            else return command.data.reply("I'm already playing!");

            await command.data.reply("Resumed song!");

        } catch(e) {
            console.log(e.message);
        }
    }
}
const { MessageFlags } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "shuffle",
    description: "Feeling lucky?",
    category: "Music",
    aliases: ["sh"],

    execute: async function(command) {
        try {
            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");
            if(!player.playing) return command.data.reply("I'm not playing anything!");

            await player.queue.shuffle();

            command.data.reply("Shuffled queue!");

        } catch(e) {
            console.log(e.message);
        }
    }
}
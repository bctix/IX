const { MessageFlags } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "skip",
    description: "Don't like this one?",
    options: [
        {
            type: "number",
            name: "position",
            description: "Song in queue you want to skip to",
            required: false
        }
    ],
    category: "Music",
    aliases: ["s"],

    execute: async function(command) {
        try {
            const position = command.isMessage ? parseInt(command.args.join(" ")) : command.data.options.getNumber("position", false);
            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");
            if(!player.playing) return command.data.reply("I'm not playing anything!");

            await player.skip(position);

            await command.data.reply({content: "Skipped song!"});

        } catch(e) {
            console.log(e.message);
        }
    }
}
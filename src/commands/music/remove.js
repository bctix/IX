const { MessageFlags, EmbedBuilder } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "remove",
    description: "Who's Steve Jobs?",
    options: [
        {
            type: "number",
            name: "position",
            description: "The song in the queue you want to skip",
            required: true
        }
    ],
    category: "Music",
    aliases: ["rm"],

    execute: async function(command) {
        try {
            var position = command.isMessage ? parseInt(command.args.join(" ")) : command.data.options.getNumber("position", true);
            position -= 1;
            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");
            if(!player.playing) return command.data.reply("I'm not playing anything!");

            var removedTrack = (await player.queue.remove(position)).removed[0];

            if(removedTrack == null)
                command.data.reply("There is no song at that position in the queue!");

            const embed = new EmbedBuilder()
            .setTitle("Removed song")
            .setDescription(`[${removedTrack.info.title}](${removedTrack.info.uri})`);
            if(removedTrack.info.artworkUrl)
                embed.setThumbnail(removedTrack.info.artworkUrl);

            command.data.reply({embeds:[embed]});

        } catch(e) {
            console.log(e.message);
        }
    }
}
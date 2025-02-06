const { MessageFlags, EmbedBuilder, Colors } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "queue",
    description: "Lists all the songs in the queue!",
    options: [
        {
            type: "number",
            name: "page",
            description: "Page in queue",
            required: false
        }
    ],
    category: "Music",
    aliases: ["q"],

    execute: async function(command) {
        try {
            var page = command.isMessage ? parseInt(command.args.join(" ")) : command.data.options.getNumber("page", false);
            if(!page || isNaN(page)) page = 1;
            page -= 1;

            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");
            if(!player.playing) return command.data.reply("I'm not playing anything!");

            const tracks = player.queue.tracks;

            var queuestring = "";

            var pageCount = Math.ceil((tracks.length - 1) / 10);

            var pagedQueue = [];
    
            for (let page = 0; page < pageCount; page++) {
                var pageList = [];
                for (let i = 0; i < 10; i++) {
                    
                    if (tracks[i + page * 10] == null) break;
                    var track = tracks[i + page * 10];
                    
                    pageList.push(track);
                }

                pagedQueue.push(pageList);
            }

            for (let i = 0; i < pagedQueue[page].length; i++) {
                var songNumber = i + page * 10;
                if (page >= 1) songNumber++;
                var songTrack = pagedQueue[page][i];
                queuestring += `${songNumber}. [${songTrack.info.title}](${songTrack.info.uri})\n`;
            }

            // embed description cant be empty
            if (queuestring.length == 0) queuestring = "None!";
            const queueEmbed = new EmbedBuilder()
                .setTitle("Queue:")
                .setDescription(
                    `\`Page ${page + 1} / ${pagedQueue.length}\` (${tracks.length} songs...)\n\n${queuestring}`,
                )
                .setFooter({text: "Loop: "+player.repeatMode})
                .setColor(Colors.Purple);

            await command.data.reply({embeds:[queueEmbed], flags: MessageFlags.Ephemeral});

        } catch(e) {
            console.log(e.message);
        }
    }
}
const { MessageFlags, EmbedBuilder, Colors } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../../utils/lavalink");

async function playSong(command, source) {
    const query = command.isMessage ? command.args.join(" ") : command.data.options.getString("query", true);

    if(!query) {
        command.data.reply("You need to search for a song!");
        return;
    }

    try {
        const player = await getPlayer(commandToLavaData(command));

        if(!player) {
            command.data.reply("I couldn't get what vc you're in!");
        }

        var res = await player.search({query: query, source: source}, command.data.member.user);
        if(!res || !res.tracks?.length)  {
            command.data.reply("Couldn't find any songs!");
            return;
        }

        if (!player.connected) await player.connect();

        await player.queue.add(
            res.loadType === "playlist" ? res.tracks : res.tracks[0]
        )

        // Only reply if its a interaction to prevent the error message
        if(!command.isMessage)
            command.data.reply({content: player.playing ? "Added your song to the queue!" : "Now playing your song!", flags: MessageFlags.Ephemeral});

        if (!player.playing) 
            await player.play();
        else {
            const embed = new EmbedBuilder()
            .setTitle(`Added ${res.loadType === "playlist" ? "playlist" : "song"} to queue!`)
            .setDescription(`${res.loadType === "playlist" ? `[${res.playlist.name}](${query})` : `[${res.tracks[0].info.title}](${res.tracks[0].info.uri})`}`);
            if(res.loadType !== "playlist")
            {
                embed.setThumbnail(res.tracks[0].info.artworkUrl);
            }
            embed.setColor(Colors.Green);
            command.data.reply({embeds:[embed]});
        }

    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    playSong,
    isNotCommand: true
}
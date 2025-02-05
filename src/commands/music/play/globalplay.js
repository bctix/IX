const { MessageFlags } = require("discord.js");
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

    } catch(e) {
        console.log(e.message);
    }
}

module.exports = {
    playSong
}
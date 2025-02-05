const { commandToLavaData, getPlayer } = require("../../../utils/lavalink");

module.exports = {
    name: "play",
    description: "Play some tunes!",
    options: [
        {
            type: "string",
            name: "query",
            description: "What do you want to play?",
            required: true
        }
    ],
    category: "Music",
    aliases: ["p"],

    execute: async function(command) {
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

            var res = await player.search({query: query, source: "ytmsearch"}, command.data.member.user);
            if(!res || !res.tracks?.length)  {
                command.data.reply("Couldn't find any songs!");
                return;
            }

            if (!player.connected) await player.connect();

            await player.queue.add(
                res.loadType === "playlist" ? res.tracks : res.tracks[0]
            )

            if (!player.playing) 
                await player.play();

            // No need to reply. events take care of that
        } catch(e) {
            console.log(e.message);
        }

    }
}
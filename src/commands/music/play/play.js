const { playSong } = require("./globalplay");

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
        await playSong(command, "ytmsearch");
    }
}
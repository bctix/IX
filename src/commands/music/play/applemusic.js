const { playSong } = require("./globalplay");

module.exports = {
    name: "applemusic",
    description: "Play something from apple music",
    options: [
        {
            type: "string",
            name: "query",
            description: "What do you want to play?",
            required: true
        }
    ],
    category: "Music",
    aliases: ["am"],

    execute: async function(command) {
        await playSong(command, "amsearch");
    }
}
const { playSong } = require("./globalplay");

module.exports = {
    name: "bandcamp",
    description: "Play something from bandcamp",
    options: [
        {
            type: "string",
            name: "query",
            description: "What do you want to play?",
            required: true
        }
    ],
    category: "Music",
    aliases: ["bc"],

    execute: async function(command) {
        await playSong(command, "bcsearch");
    }
}
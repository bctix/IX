const { playSong } = require("./globalplay.js")

module.exports = {
    name: "spotify",
    description: "Play something from spotify",
    options: [
        {
            type: "string",
            name: "query",
            description: "What do you want to play?",
            required: true
        }
    ],
    category: "Music",
    aliases: ["sp"],

    execute: async function(command) {
        await playSong(command, "spsearch");
    }
}
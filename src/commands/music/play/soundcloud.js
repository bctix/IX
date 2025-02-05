const { playSong } = require("./globalplay");

module.exports = {
    name: "soundcloud",
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
    aliases: ["sc"],

    execute: async function(command) {
        await playSong(command, "spsearch");
    }
}
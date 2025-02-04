module.exports = {
    name: "ping",
    description: "Replies with pong!",
    options: [
        {
            type: "string",
            name: "name",
            description: "Should the bot reply with your name?"
        }
    ],
    category: "Misc",
    aliases: ["pwong"],

    execute: async function(command) {
        const msg = await command.data.reply("Pong!");
    }
}
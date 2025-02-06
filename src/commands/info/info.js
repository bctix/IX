const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    name: "info",
    description: "Gives you all info on ix!",
    category: "Misc",

    execute: async function(command) {
        const embed = new EmbedBuilder()
        .setTitle("IX")
        .setDescription(`A bot by bctix`)
        .setFooter({text: `version: ${command.client.botversion}`})
        .setColor(Colors.Purple);

        const msg = await command.data.reply({embeds: [embed]});
    }
}
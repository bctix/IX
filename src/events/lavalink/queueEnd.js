const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    name: "queueEnd",
    once: false,
    async execute(client, player, track, payload) {
        var channel = client.channels.cache.get(player.textChannelId);
        var guild = client.guilds.cache.get(player.guildId)

        var embed = new EmbedBuilder();

        embed.setTitle("Queue ended!");
        embed.setDescription(`Leaving if another song is not played for 30 seconds.`);
        embed.setColor(Colors.Red);
        
        channel.send({embeds: [embed]});
    },
  };
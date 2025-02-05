const { EmbedBuilder, Colors } = require("discord.js");


module.exports = {
    name: "trackStart",
    once: false,
    async execute(client, player, track) {
        var channel = client.channels.cache.get(player.textChannelId);
        var guild = client.guilds.cache.get(player.guildId)

        var embed = new EmbedBuilder();

        embed.setTitle("Now playing song:");
        embed.setDescription(`[${track.info.title}](${track.info.uri})`);
        embed.setColor(Colors.Green);
        
        channel.send({embeds: [embed]});
    },
  };
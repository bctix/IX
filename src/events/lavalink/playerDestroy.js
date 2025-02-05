const { EmbedBuilder, Colors } = require("discord.js");


module.exports = {
    name: "playerDestroy",
    once: false,
    async execute(client, player, reason) {
        var channel = client.channels.cache.get(player.textChannelId);

        var embed = new EmbedBuilder();

        embed.setTitle("Player Destroyed");
        embed.setDescription(`Reason: ${reason || "Unknown"}`);
        embed.setColor(Colors.Red);
        
        channel.send({embeds: [embed]});
    },
  };
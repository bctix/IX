const { EmbedBuilder, Colors } = require("discord.js");


module.exports = {
    name: "playerDestroy",
    once: false,
    async execute(client, player, reason) {
        var channel = client.channels.cache.get(player.textChannelId);

        var embed = new EmbedBuilder();

        switch(reason) {
            case "stopRequest":
                embed.setTitle("Leaving VC");
                embed.setDescription(`See-ya!`);
                embed.setColor(Colors.Red);
            default:
                embed.setTitle("Leaving VC");
                embed.setDescription("Something happened to make me leave vc!");
                embed.setColor(Colors.Red);
        }
        
        channel.send({embeds: [embed]});
    },
  };
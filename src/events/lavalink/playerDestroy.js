const { EmbedBuilder, Colors } = require("discord.js");
const { log } = require("../../utils/utils");


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
                break;
            case "QueueEmpty":
                embed.setTitle("Leaving VC");
                embed.setDescription("I wasn't playing anything for a while.")
                embed.setColor(Colors.Red);
                break;
            default:
                embed.setTitle("Leaving VC");
                embed.setDescription("Something happened to make me leave vc!");
                embed.setColor(Colors.Red);
                log("ERROR", "src/events/lavalink/playerDestroy.js", "Unknown Player destroy: "+reason);
                break;
        }
        
        channel.send({embeds: [embed]});
    },
  };
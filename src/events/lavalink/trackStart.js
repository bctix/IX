const { EmbedBuilder, Colors, resolveColor } = require("discord.js");
const { Vibrant } = require("node-vibrant/node");

module.exports = {
    name: "trackStart",
    once: false,
    async execute(client, player, track) {
        var channel = client.channels.cache.get(player.textChannelId);
        var guild = client.guilds.cache.get(player.guildId)
        var member = guild.members.cache.get(track.requester.id)

        var embed = new EmbedBuilder();

        embed.setTitle("Now playing song:");
        embed.setDescription(`[${track.info.title}](${track.info.uri})`);
        embed.addFields(
            {name: "Artist", value: `${track.info.author}`, inline: true},
        );
        if(track.info.sourceName)
            embed.addFields(
                {name: "Source", value: `${track.info.sourceName} ${await client.emoji.getEmoji(track.info.sourceName)}`, inline: true},
            );
        if(track.info.artworkUrl)
        {
            embed.setThumbnail(track.info.artworkUrl);

            var vibrant = await Vibrant.from(track.info.artworkUrl)
            var palette = await vibrant.getPalette()

            if(palette != null)
                embed.setColor(resolveColor(palette.Vibrant.hex))
        } else {
            embed.setColor(Colors.Green);
        }

        embed.setFooter({iconURL: member.displayAvatarURL({}), text: `Requested by ${member.user.username}`})
        
        
        channel.send({embeds: [embed]});
    },
  };
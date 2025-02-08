const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",
    description: "Gives you all the commands!",
    category: "Misc",

    execute: async function(command) {
        const embed = new EmbedBuilder()
        .setTitle("Commands:")
        .setDescription(`All commands can be used as a slash (/) command, or a prefix (${process.env.PREFIX})\nThe letters after the command name is a commands alias for prefix commands.\nFor example: \`${process.env.PREFIX}play\` is the same as \`${process.env.PREFIX}p\``)
        .addFields(
            {name: "Play Commands:\n(All these commands play a song)", value: `\`All these commands can use a link OR can be searched via song title\`\n
\`play\` | \`p\` - Searches Youtube Music
\`spotify\` | \`sp\` - Searches Spotify
\`youtube\` | \`yt\` - Searches normal Youtube
\`soundcloud\` | \`sc\` - Searches SoundCloud
\`bandcamp\` | \`bc\` - Searches BandCamp
\`applemusic\` | \`am\` - Searches Apple Music`},
            { name: "Music Commands:\n(All the commands to control the music)", value: `
\`stop\` | \`st\` - Stops song, clears queue, and leaves VC
\`loop\` | \`l\` (\`single\`|\`queue\`|\`none\`) - Sets the loop mode.
\`remove\` | \`r\` (\`number\`) - Removes the song at that position in the queue.
\`skip\` | \`s\` (?\`number\`) - Skips the current song, if number is proveded, skip to that song.
\`queue\` | \`q\` - Display the current queue.
\`shuffle\` | \`sh\` - Shuffles the queue.
\`pause\` | \`pa\` - Pause the current song.
\`resume\` | \`rs\` - Resume paused song.
\`filter\` | \`fl\` (\`filter\`) - Applies a filter to the song. Refer to \`Music Filters\` below for filters to use.
                `},
            { name: `Music Filters:\n All are filters to be used with \`${process.env.PREFIX}filter\`!`, value: `
\`clear\` - Remove all filters
\`nightcore\` - Faster song
\`vaporwave\` - Slower song`}
        );

        const msg = await command.data.reply({embeds: [embed]});
    }
}
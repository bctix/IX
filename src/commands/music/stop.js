const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "stop",
    description: "Stop the tunes!",
    category: "Music",
    aliases: ["s"],

    execute: async function(command) {
        try {
            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");
                
            console.log(command.data.member);
            if(player.playing) player.destroy(`${command.data.member.user.username} stopped the music.`);

            await command.data.reply("Stopped the music");

        } catch(e) {
            console.log(e.message);
        }
    }
}
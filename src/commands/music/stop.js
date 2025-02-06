const { MessageFlags } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "stop",
    description: "Stop the tunes!",
    category: "Music",
    aliases: ["st"],

    execute: async function(command) {
        try {
            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");
                
            if(player.playing) await player.destroy(`stopRequest`);

            // Only reply if its a interaction to prevent the error message
            if(!command.isMessage)
                await command.data.reply({content: "Stopped playing!", flags: MessageFlags.Ephemeral});

        } catch(e) {
            console.log(e.message);
        }
    }
}
const { MessageFlags, EmbedBuilder, Colors } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "loop",
    description: "Like this one?",
    options: [
        {
            type: "string",
            name: "loopmode",
            description: "How loop?",
            choices: [
                { name: "None", value: "none" },
                { name: "Track", value: "track" },
                { name: "Queue", value: "queue" }
            ],
            required: true
        }
    ],
    category: "Music",
    aliases: ["l"],

    execute: async function(command) {
        try {
            var loop = command.isMessage ? command.args.join(" ") : command.data.options.getString("loopmode", true);
            if(loop === "none") loop = "off";
            if(loop === "single") loop = "track";

            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");
            if(!player.playing) return command.data.reply("I'm not playing anything!");

            await player.setRepeatMode(loop);

            const embed = new EmbedBuilder()
            .setTitle("Set loop to "+player.repeatMode)
            .setColor(Colors.Blurple);

            await command.data.reply({embeds: [embed], flags: MessageFlags.Ephemeral});

        } catch(e) {
            console.log(e.message);
        }
    }
}
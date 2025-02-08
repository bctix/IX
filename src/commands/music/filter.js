const { MessageFlags, EmbedBuilder, Colors } = require("discord.js");
const { commandToLavaData, getPlayer } = require("../../utils/lavalink");

module.exports = {
    name: "filter",
    description: "I like your sounds magic man!",
    options: [
        {
            type: "string",
            name: "filter",
            description: "What filter to toggle?",
            choices: [
                { name: "Clear Filters", value: "clear" },
                { name: "Nightcore", value: "nightcore" },
                { name: "Vaporwave", value: "Vaporwave" }
            ],
            required: true
        }
    ],
    category: "Music",
    aliases: ["fl"],

    execute: async function(command) {
        try {
            var filter = command.isMessage ? command.args.join(" ") : command.data.options.getString("filter", true);
            filter = filter.toLowerCase();

            const player = await getPlayer(commandToLavaData(command));
            const vcId = command.data.member.voice.channelId;

            if(!player) return command.data.reply("I couldn't get what vc you're in!");
            if(player.voiceChannelId !== vcId) return command.data.reply("You need to be in my vc!");

            var string = "";
            switch(filter) {
                case "clear":
                    await player.filterManager.resetFilters();
                    string = "Removing all filters!";
                    break;
                case "nightcore":
                    string += `${player.filterManager.filters.vaporwave ? "Disabling vaporwave, " : ""}`
                    string += `${player.filterManager.filters.nightcore ? "Disabling nightcore " : "Enabling nightcore "}`
                    await player.filterManager.toggleNightcore();
                    break;
                case "vaporwave":
                    string += `${player.filterManager.filters.nightcore ? "Disabling nightcore, " : ""}`
                    string += `${player.filterManager.filters.vaporwave ? "Disabling vaporwave " : "Enabling vaporwave "}`
                    await player.filterManager.toggleVaporwave();
                    break;
                default:
                    string += "That filter doesn't exist, or is not implimented yet.\nAvailable options are:\n`clear`, `nightcore`, and `vaporwave`";
                    break;
            }

            await command.data.reply(string);

        } catch(e) {
            console.log(e.message);
        }
    }
}
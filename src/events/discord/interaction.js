const { Events } = require("discord.js");
const { log } = require("../../utils/utils");

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(client, interaction) {
        try {
            if (!interaction.isChatInputCommand()) return;

            const command = client.commands.get(interaction.commandName);

            if (!command) return;
            if (command.devOnly && !devs.includes(message.author.id)) return;

            command.execute({
                client: client,
                data: interaction
            })
        } catch (e) {
            log("ERROR", "src/interaction.js", "Something went wrong with a interaction: "+e.message);
        }
    },
  };
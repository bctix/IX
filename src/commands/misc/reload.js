const { registerCommands } = require("../../utils/registry");

module.exports = {
    name: "reload",
    description: "Reloads all commands",
    category: "Misc",

    execute: async function(command) {
        if(command.data.member.user.id != "205580500125876224") return command.data.reply("You do not have permission to run this command!");
        command.client.commands.clear();
        command.client.commandaliases.clear();

        await registerCommands(command.client, "../commands");
        command.data.reply("Reloaded all commands!");
    }
}
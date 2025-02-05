module.exports = {
    name: "echo",
    description: "Makes IX say what you say!",
    options: [
        {
            type: "string",
            name: "text",
            description: "Echo! Echo! echo. echo... erm"
        }
    ],
    category: "Misc",

    execute: async function(command) {
        const text = command.isMessage ? command.args.join(" ") : command.data.options.getString("echo", true);
        await command.data.reply(text);
    }
}
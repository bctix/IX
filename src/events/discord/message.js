const { Events } = require("discord.js");
const { log } = require("../../utils/utils");

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(client, message) {
        try {
            if (message.author.bot) return;

            const prefixRegex = new RegExp(`^(<@${client.user.id}>|${process.env.PREFIX})`);
            if (!prefixRegex.test(message.content)) return;

            const [, matchedPrefix] = message.content.match(prefixRegex);
            let msgargs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            let cmdName = msgargs.shift().toLowerCase();

            const command = client.commands.get(cmdName) || client.commandaliases.get(cmdName);
            
            
            if (!command) return;

            if (command.devOnly && !devs.includes(message.author.id)) return;

            command.execute({
                client: client,
                data: message,
                args: msgargs
            })

        if (!prefixRegex.test(message.content)) return;
        } catch (e) {
            log("ERROR", "src/message.js", "Something went wrong with a message: "+e.message);
        }
    },
  };
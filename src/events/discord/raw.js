const { Events } = require("discord.js");

module.exports = {
    name: Events.Raw,
    once: false,
    async execute(client, d) {
        if(client.lavalink)
            client.lavalink.sendRawData(d);
    },
  };
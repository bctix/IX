const { Events } = require("discord.js");
const { log } = require("../../utils/utils");
const { deployCommands } = require("../../utils/registry");
const { initLavalink } = require("../../utils/lavalink");

module.exports = {
    name: Events.Raw,
    once: false,
    async execute(client, d) {
        if(client.lavalink)
            client.lavalink.sendRawData(d);
    },
  };
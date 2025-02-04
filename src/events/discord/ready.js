const { Events } = require("discord.js");
const { log } = require("../../utils/utils");
const { deployCommands } = require("../../utils/registry");
const { initLavalink } = require("../../utils/lavalink");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
      log("SUCCESS", "src/ready.js", "Successfully loaded and logged in!");

      await deployCommands(client);
      await initLavalink(client);
    },
  };
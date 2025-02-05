const { Events } = require("discord.js");
const { log, parseBool } = require("../../utils/utils");
const { deployCommands } = require("../../utils/registry");
const { initLavalink } = require("../../utils/lavalink");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
      log("SUCCESS", "src/ready.js", "Successfully loaded and logged in!");

      await deployCommands(client);

      if(parseBool(process.env.USE_LAVALINK))
        await initLavalink(client);
    },
  };
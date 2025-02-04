const dotenv = require('dotenv');
dotenv.config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { registerEvents, registerCommands } = require("./utils/registry.js");
const package = require("../package.json");

const client = new Client({ intents:  [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent]});

(async () => {
    client.commands = new Collection();
    client.commandaliases = new Collection();
    client.categories = new Collection();
    client.botversion = package.version;
    
    await registerEvents(client, '../events/discord');
    await registerCommands(client, "../commands");

    await client.login(process.env.DISCORD_TOKEN);
})();
/*
    File to create lavalink client and helpers for easy client handling.
*/

const { LavalinkManager } = require("lavalink-client");

async function initLavalink(client) {
    client.lavalink = new LavalinkManager({
        nodes: [
            { 
                authorization: process.env.LAVALINK_PASSWORD,
                host: process.env.LAVALINK_HOST,
                port: parseInt(process.env.LAVALINK_PORT)
            }
        ],
        sendToShard: (guildId, payload) =>
            client.guilds.cache.get(guildId)?.shard?.send(payload),
        client: {
            id: client.user.id,
            username: client.user.username,
        },
        playerOptions: {
            onEmptyQueue: {
                destroyAfterMs: 30_000, 
            }
        }
    });
}

module.exports = {
    initLavalink
}
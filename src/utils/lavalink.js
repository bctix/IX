/*
    File to create lavalink client and helpers for easy client handling.
*/

const { LavalinkManager } = require("lavalink-client");

async function initLavalink(client) {
    client.lavalink = new LavalinkManager({
        
    })
}

module.exports = {
    initLavalink
}
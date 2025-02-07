/*
    File to create lavalink client and helpers for easy client handling.
*/

const { LavalinkManager } = require("lavalink-client");
const { registerAlternateEvents } = require("./registry");
const { log } = require("./utils");

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
        emitNewSongsOnly: true, // don't emit "looping songs"
        playerOptions: {
            onEmptyQueue: {
                destroyAfterMs: 30_000, 
            }
        }
    });

    await registerAlternateEvents(client.lavalink, client, '../events/lavalink');

    await client.lavalink.init({id: client.user.id, username: client.user.username});
    
    log("SUCCESS", "src/utils/lavalink.js", "Lavalink created");
}

function commandToLavaData(command) {
    return {voiceChannel: command.data.member.voice, textChannelId: command.data.channelId, requestor: command.data.member.user, client: command.client}
}

async function getPlayer(lavadata) {
    const vc = lavadata.voiceChannel.channel;
    if (!vc) throw new Error("You need to be in a vc! (or i dont have access to it.)");
    if (!vc.joinable || !vc.speakable) throw new Error("I cannot join your vc!");
    
    const player =
    lavadata.client.lavalink.getPlayer(vc.guildId) ||
    (await lavadata.client.lavalink.createPlayer({
      guildId: vc.guildId,
      voiceChannelId: lavadata.voiceChannel.channelId,
      textChannelId: lavadata.textChannelId,
      selfDeaf: true,
      selfMute: false,
      volume: 50,
    }));

    return player;
}

module.exports = {
    initLavalink, getPlayer, commandToLavaData
}
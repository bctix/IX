import { Player } from "lavalink-client/dist/types";
import { CustomClient } from "../../types/bot_types";
import { VoiceChannel } from "discord.js";
import { printLine } from "../../utils/utils";


export default {
    name: "playerCreate",
    async execute(Client: CustomClient, player: Player) {
        printLine(`{blue A new player was created with node:} {yellow ${player.node.id}}`)
    },
};
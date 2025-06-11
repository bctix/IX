import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "stop",
        description: "Stop some tunes!",
        aliases: ["st"],
        usage: "Stops the current song, clears the queue, and leaves VC.",
        category: "music (controls)",
        argParser(str: string) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            await player.destroy("stopRequest");

            // Only reply if its a interaction to prevent the error message
            if (!command.isMessage) {await (command.data as ChatInputCommandInteraction).reply({ content: "Stopped playing!", flags: MessageFlags.Ephemeral });}
        },
    } as ChatCommandOptions,
);

export default textcommand;
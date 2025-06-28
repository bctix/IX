import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "back",
        description: "Yes, hello! I was wondering if you could play that song again!",
        aliases: ["b"],
        category: "music (controls)",
        usage: "Played the previously ended song.",
        argParser(str: string) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            const previous = await player.queue.shiftPrevious();
            if (!previous) { await command.data.reply("No previous track found!"); return; }
            if (player.queue.current) await player.queue.add(player.queue.current, 0);
            await player.play({ clientTrack: previous });

            // Only reply if its a interaction to prevent the error message
            await command.data.reply({ content: "Playing previous song!" });
        },
    } as ChatCommandOptions,
);

export default textcommand;
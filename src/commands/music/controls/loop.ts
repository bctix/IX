import { ApplicationCommandOptionType, Colors, EmbedBuilder } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_types";
import { getLavalinkPlayer, commandToLavaData, checkPlayer } from "../../../utils/lavalink";

const loopChoices = ["off", "track", "queue"];

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "loop",
        description: "Like this one?",
        aliases: ["l"],
        options: [
            {
                name: "type",
                description: "What song to skip.",
                required: true,
                default: "",
                choices: [
                    { name: "None", value: "none" },
                    { name: "Track", value: "track" },
                    { name: "Queue", value: "queue" },
                ],
                type: ApplicationCommandOptionType.String,
            },
        ],
        category: "music (controls)",
        usage: "Sets the loop mode for the server.",
        argParser(str: string) {
            let type = str;
            if (type.toLowerCase() === "") type = "toggle";
            if (["none", "0", "n", "off"].includes(type.toLowerCase())) type = "off";
            if (["s", "track", "1", "single"].includes(type.toLowerCase())) type = "track";
            if (["q", "queue"].includes(type.toLowerCase())) type = "queue";
            return [type];
        },
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            let loopMode = command.args[0];

            if (loopMode === "toggle") loopMode = loopChoices[loopChoices.indexOf(player.repeatMode) === 2 ? 0 : loopChoices.indexOf(player.repeatMode) + 1];

            await player.setRepeatMode(loopMode);

            const embed = new EmbedBuilder()
                .setTitle("Set loop to " + player.repeatMode)
                .setColor(Colors.Blurple);

            await command.data.reply({ embeds: [embed] });
        },
    } as ChatCommandOptions,
);

export default textcommand;
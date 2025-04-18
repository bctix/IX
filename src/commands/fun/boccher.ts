import { fetch } from "undici";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_classes";
import { Colors, EmbedBuilder } from "discord.js";
import { msToTime } from "../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "boccher",
        description: "bwaaa",
        category: "fun",
        usage: "Sends a random frame of the anime Bocchi the Rock!",
        async execute(command: ChatCommandExecute) {
            const res = await fetch("https://boccher.pixelboom.dev/api/frames");

            if(!res.ok) { command.data.reply("Something went wrong getting the frame!"); return; }
            const data = await res.json() as { url: string, timestamp: number, episodeDuration: number, source: number };

            const embed = new EmbedBuilder();
            embed.setTitle("Your bocchi the rock");
            embed.setImage(data.url);
            embed.addFields(
                {name: "Episode", value: data.source.toString(), inline: false},
                {name: "Time", value: `${msToTime(data.timestamp * 1000)} - ${msToTime(data.episodeDuration * 1000)}`}
            );
            embed.setColor(Colors.LuminousVividPink);

            await command.data.reply({embeds: [embed]});
        },
    } as ChatCommandOptions
);

export default textcommand;
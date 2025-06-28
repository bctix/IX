import { fetch } from "undici";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_types";
import { Colors, EmbedBuilder } from "discord.js";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "cat",
        description: "meoww",
        usage: "Sends a random cat image!",
        category: "fun",
        async execute(command: ChatCommandExecute) {
            const res = await fetch(
                "https://cataas.com/cat",
                {
                    headers: {
                        "Accept": "application/json",
                    },
                },
            );

            if (!res.ok) { command.data.reply("Something went wrong getting the image!"); return; }
            const data = await res.json() as { url: string };

            if (!data.url) { command.data.reply("Failed to get image!"); return; }

            const embed = new EmbedBuilder();
            embed.setTitle("Look at this cat lol");
            embed.setImage(data.url);
            embed.setColor(Colors.Green);

            await command.data.reply({ embeds: [embed] });
        },
    } as ChatCommandOptions,
);

export default textcommand;
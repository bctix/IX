import { EmbedBuilder } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_classes";
import { prefix } from "../../utils/constants";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "help",
        description: "Confused?",
        category: "info",
        usage: "Sends this embed.",
        async execute(execute: ChatCommandExecute) {
            const embed = new EmbedBuilder();
            embed.setTitle("Command list");
            embed.setDescription(`All commands can be used as slash commands or prefix commands with \`${prefix}\`.
                Text inside [] are command aliases, they can be used as an alternative to the command name.
                Text inside () are command arguments. Arguments with a ? are optional.`);

            execute.client.categories.forEach((commands, category) => {
                
                let valueStr = "";

                commands.forEach((commandName) => {
                    const command = execute.client.chatcommands.get(commandName);
                    if (!command) return;
                    if (command.devOnly) return;
                    if (command.isAlias) return;

                    let optionsStr = "";
                    command.options?.forEach((option) => {
                        optionsStr += `\`${option.name}${option.required ? "" : "?"}\`${option === command.options?.at(-1) ? "" : ", "}`;
                    });

                    valueStr += `\\- \`${command.name}\` ${command.aliases ? `[\`${command.aliases.join(", ")}\`]` : ""} ${optionsStr !== "" ? `(${optionsStr})` : ""} - ${command.usage}\n`;
                });

                embed.addFields({ name: `>> ${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()} <<`, value: valueStr });
                
            });

            execute.data.reply({embeds: [embed]});
        },
    } as ChatCommandOptions
);

export default textcommand;
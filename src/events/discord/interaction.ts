import { BaseInteraction, ChatInputCommandInteraction, ContextMenuCommandInteraction, Events } from "discord.js";
import { CustomClient, ChatCommandExecute } from "../../types/bot_classes";
import { printLine } from "../../utils/utils";

export default {
	name: Events.InteractionCreate,
	async execute(Client: CustomClient, baseInteraction: BaseInteraction) {
		if (baseInteraction.isContextMenuCommand()) {
			const interaction = baseInteraction as ContextMenuCommandInteraction;
			const command = Client.contextmenucommands.get(interaction.commandName);
			if (!command) return;

			try {
				command.execute(Client, interaction);
			} catch (e) {
				console.error(e);
			}
		}
		if (baseInteraction.isChatInputCommand()) {
			const interaction = baseInteraction as ChatInputCommandInteraction;
			const command = Client.chatcommands.get(interaction.commandName);
			if (!command) return;

			if (command.devOnly || command.noSlash) return;

			try {
				command.execute(new ChatCommandExecute(Client, command, interaction));
			} catch (e) {
				printLine(`{red.bold There was an error executing the command ${command.name}:} ${e}`);
				await interaction.reply("There was an error running the command!");
			}
		}
	},
};
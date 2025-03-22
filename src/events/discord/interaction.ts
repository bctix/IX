import { BaseInteraction, ChatInputCommandInteraction, Events } from "discord.js";
import { CustomClient, ChatCommandExecute } from "../../types/bot_types.d";

export default {
	name: Events.InteractionCreate,
	async execute(Client: CustomClient, baseInteraction: BaseInteraction) {
		if (baseInteraction.isMessageContextMenuCommand()) {
			baseInteraction.reply("Message context menu commands are not supported yet.");
			return;
		}
		if (baseInteraction.isChatInputCommand()) {
			const interaction = baseInteraction as ChatInputCommandInteraction;
			const command = Client.chatcommands.get(interaction.commandName);
			if (!command) return;

			if (command.devOnly || command.noSlash) return;

			try {
				command.execute(new ChatCommandExecute(Client, command, interaction));
			}
			catch (e) {
				console.error(e);
			}
		}
	},
};
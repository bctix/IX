import { ContextCommand, CustomClient } from "../../types/bot_types.d";
import { ApplicationCommandType, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction } from "discord.js";

const menucommand: ContextCommand = new ContextCommand();

menucommand.name = "reverse";
menucommand.type = ApplicationCommandType.Message;
menucommand.description = "Reverses the text in the message!";
menucommand.execute = (client: CustomClient, interaction: ContextMenuCommandInteraction) => {
	const er = interaction as MessageContextMenuCommandInteraction;
	const message = er.targetMessage.content;
	const reversedMessage = message.split("").reverse().join("");
	interaction.reply(`${reversedMessage}`);
};

export default menucommand;
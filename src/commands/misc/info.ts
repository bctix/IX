import { ContextCommand, CustomClient } from "../../types/bot_types.d";
import { ApplicationCommandType, ContextMenuCommandInteraction, EmbedBuilder, UserContextMenuCommandInteraction } from "discord.js";

const menucommand: ContextCommand = new ContextCommand();

menucommand.name = "Get User Info";
menucommand.type = ApplicationCommandType.User;
menucommand.description = "Get some info about a user";
menucommand.execute = (client: CustomClient, interaction: ContextMenuCommandInteraction) => {
	const er = interaction as UserContextMenuCommandInteraction;
	const user = er.targetUser;

	const embed = new EmbedBuilder();
	embed.setTitle(`${user.username}'s Info`);
	embed.setDescription(`User ID: ${user.id}`);
	embed.setThumbnail(user.displayAvatarURL() ?? undefined);

	const userFlags = user.flags ? user.flags.toArray().join(", ") : "No Flags";

	embed.addFields([
		{ name: "Username", value: user.username, inline: true },
		{ name: "Discriminator", value: user.discriminator, inline: true },
		{ name: "Bot?", value: user.bot ? "Yes" : "No", inline: true },
		{ name: "Created At", value: user.createdAt.toDateString(), inline: true },
		{ name: "Avatar URL", value: `[Click Here](${user.displayAvatarURL()})`, inline: true },
		{ name: "Banner URL", value: user.bannerURL() ? `[Click Here](${user.bannerURL()})` : "No Banner", inline: true },
		{ name: "Flags", value: userFlags, inline: true },
	]);

	interaction.reply({ embeds: [embed] });
};

export default menucommand;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client, Collection, Message } from "discord.js";
import { LavalinkManager } from "lavalink-client/dist/types";

export declare class CustomClient extends Client {
	/**
	 * All the chat commands (slash commands & prefix commands) loaded in the bot.
	 */
	public chatcommands: Collection<string, ChatCommand>;
	/**
	 * The categories of the commands.
	 */
	public categories: Collection<string, string[]>;

	/**
	 * The lavalink manager.
	 */
	public lavalink: LavalinkManager;

	/**
	 * the `Date.now()` of when the bot started.
	 */
	public startDate: number;
}

export class ChatCommandExecute {

	/**
	* The client.
	*/
	public client: CustomClient;

	/**
	 * If true, the command is comes from a prefix command.
	 * */
	public isMessage: boolean;

	/**
	 * The ChatInputCommandInteraction or Message.
	 */
	public data: ChatInputCommandInteraction|Message;

	/**
	 * The command metadata
	 */
	public command:ChatCommand;

	/**
	 * The arguments of the command
	 */
	public args: any[] = [];

	constructor(client:CustomClient, command:ChatCommand, data:ChatInputCommandInteraction|Message) {
		if (data instanceof Message) {
			this.fromMessage(client, command, data);
		}
		else {
			this.fromInteraction(client, command, data);
		}
	}

	private fromInteraction(client:CustomClient, command:ChatCommand, interaction: ChatInputCommandInteraction) {
		this.client = interaction.client;
		this.isMessage = false;
		this.command = command;
		this.data = interaction;

		if (command.options) {
			command.options.forEach((option:ChatCommandOption) => {
				switch (option.type) {
				case ApplicationCommandOptionType.Subcommand:
				{
					let optionValue = interaction.options.getSubcommand(option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.SubcommandGroup:
				{
					let optionValue = interaction.options.getSubcommandGroup(option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.String:
				{
					let optionValue = interaction.options.getString(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.Integer:
				{
					let optionValue = interaction.options.getInteger(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.Boolean:
				{
					let optionValue = interaction.options.getBoolean(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.User:
				{
					let optionValue = interaction.options.getUser(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.Channel:
				{
					let optionValue = interaction.options.getChannel(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.Role:
				{
					let optionValue = interaction.options.getRole(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.Mentionable:
				{
					let optionValue = interaction.options.getMentionable(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.Number:
				{
					let optionValue = interaction.options.getNumber(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				case ApplicationCommandOptionType.Attachment:
				{
					let optionValue = interaction.options.getAttachment(option.name, option.required);

					if (optionValue === null) {optionValue = option.default;}

					this.args.push(optionValue);
					break;
				}
				}
			});
		}
	}

	private fromMessage(client:CustomClient, command:ChatCommand, message: Message) {
		this.isMessage = true;
		this.command = command;
		this.data = message;
		this.client = client;

		const content = message.content;

		const prefixRegex = new RegExp(`^(<@${client.user.id}>|${process.env.PREFIX})`);
		if (!prefixRegex.test(content)) return;

		const [, matchedPrefix] = message.content.match(prefixRegex);
		const msgargs = message.content.slice(matchedPrefix.length).trim().split(/ +/);

		this.args = msgargs;
	}
}
export class ChatCommand {

	/**
	 * The name of the command that the user will type
	 */
	name:string;

	/**
	 * Options for command
	 */
	options?:ChatCommandOption[];

	/**
	 * Aliases of the command
	 */
	aliases?:string[];

	/**
	 * Descriptions for command
	 */
	description:string;

	/**
	 * Proper usage for command for help command
	 */
	usage?:string;

	/**
	 * Checks if a slash command should be generated, and created.
	 */
	noSlash?:boolean;

	/**
	 * If only devs can use this command
	 */
	devOnly?:boolean;

	/**
	 * This command is an alias of another command
	 */
	isAlias?:boolean;

	/**
	 * The function that is ran when this command is called.
	 * @param command The command data
	 */
	ignore?:boolean;

	/**
	 * The function that is ran when this command is called.
	 * @param command The command data
	 */
	execute(p: ChatCommandExecute): any;

	/**
	 * Function that formats the `args` property when the command is called for prefix commands.
	 * @param str The content of the message without the command.
	 */
	argParser?(str: string, message:Message): any[];
}
export interface ChatCommandOption {
    name:string;
    description:string;
    required:boolean;
    default:any;
    type:ApplicationCommandOptionType
    choices?:APIApplicationCommandOptionChoice<string>[]|APIApplicationCommandOptionChoice<number>[];
}
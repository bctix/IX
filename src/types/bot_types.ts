/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIApplicationCommandOptionChoice, APIUser, ApplicationCommandOptionType, ChatInputCommandInteraction, Client, ClientOptions, Collection, ContextMenuCommandInteraction, ContextMenuCommandType, InteractionContextType, Message, User, VoiceState } from "discord.js";
import { LavalinkManager } from "lavalink-client";

export interface LavaData {
    voiceChannel: VoiceState;
    textChannelId?: string;
    requestor?: User|APIUser;
    client: CustomClient;
}

export interface LavalinkNode {
    host: string;
    port: number;
    password: string;
    id: string;
    signalTimeout?: number;
}

export interface LavalinkConfig {
    nodes: LavalinkNode[];
    emitNewSongsOnly?: boolean;
    timeTillLeaveWhenEmpty?: number;
}

export interface TrackInfoOverride {
    title?: string,
    author?: string
}

export class CustomClient extends Client {
    public chatcommands: Collection<string, ChatCommand>;
    public contextmenucommands: Collection<string, ContextCommand>;
    public categories: Collection<string, string[]>;
    public startDate: number;
    public isShuttingDown: boolean;
    // Lavalink will be initialized in index.ts
    public lavalink!: LavalinkManager;

    constructor(options: ClientOptions) {
        super(options);
        this.chatcommands = new Collection();
        this.contextmenucommands = new Collection();
        this.categories = new Collection();
        this.startDate = Date.now();
        this.isShuttingDown = false;
    }
}

export class ChatCommandExecute {
    public client!: CustomClient;
    public isMessage!: boolean;
    public data!: ChatInputCommandInteraction | Message;
    public command!: ChatCommand;
    public args!: any[];

    constructor(client: CustomClient, command: ChatCommand, data: ChatInputCommandInteraction | Message) {
        if (data instanceof Message) {
            this.fromMessage(client, command, data);
        }
        else {
            this.fromInteraction(client, command, data);
        }
    }

    private fromInteraction(client: CustomClient, command: ChatCommand, interaction: ChatInputCommandInteraction) {
        this.client = client;
        this.isMessage = false;
        this.command = command;
        this.data = interaction;
        this.args = [];

        if (command.options) {
            command.options.forEach((option: ChatCommandArgOption) => {
                let optionValue;
                switch (option.type) {
                    case ApplicationCommandOptionType.Subcommand:
                        optionValue = interaction.options.getSubcommand(option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.SubcommandGroup:
                        optionValue = interaction.options.getSubcommandGroup(option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.String:
                        optionValue = interaction.options.getString(option.name, option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.Integer:
                        optionValue = interaction.options.getInteger(option.name, option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.Boolean:
                        optionValue = interaction.options.getBoolean(option.name, option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.User:
                        optionValue = interaction.options.getUser(option.name, option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.Channel:
                        optionValue = interaction.options.getChannel(option.name, option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.Role:
                        optionValue = interaction.options.getRole(option.name, option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.Mentionable:
                        optionValue = interaction.options.getMentionable(option.name, option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.Number:
                        optionValue = interaction.options.getNumber(option.name, option.required) ?? option.default;
                        break;
                    case ApplicationCommandOptionType.Attachment:
                        optionValue = interaction.options.getAttachment(option.name, option.required) ?? option.default;
                        break;
                }
                this.args.push(optionValue);
            });
        }
    }

    private fromMessage(client: CustomClient, command: ChatCommand, message: Message) {
        this.isMessage = true;
        this.command = command;
        this.data = message;
        this.client = client;

        const content = message.content;
        if (!client.user) {
            throw new Error("User is null!");
            return;
        }
        const prefixRegex = new RegExp(`^(<@${client.user.id}>|${process.env.PREFIX})`);
        if (!prefixRegex.test(content)) return;

        const match = message.content.match(prefixRegex);
        if (!match) return;
        const [, matchedPrefix] = match;
        const msgargs = message.content.slice(matchedPrefix.length).trim().split(/ +/);

        this.args = msgargs;
    }
}

export interface ChatCommandOptions {
    name: string;
    description: string;
    category: string;
    options?: ChatCommandArgOption[];
    contexts?: InteractionContextType[];
    aliases?: string[];
    usage?: string;
    isAlias?: boolean;
    flags?: ChatCommandFlag[] | ChatCommandFlag;
    execute: (p: ChatCommandExecute) => any;
    argParser?: (str: string, message: Message) => any[];
}

export class ChatCommand {
    public name: string;
    public description: string;
    public category: string;
    public options?: ChatCommandArgOption[];
    public contexts?: InteractionContextType[];
    public aliases?: string[];
    public usage?: string;
    public isAlias?: boolean;
    public flags?: ChatCommandFlag[] | ChatCommandFlag;
    public execute: (p: ChatCommandExecute) => any;
    public argParser?: (str: string, message: Message) => any[];

    public constructor(options: ChatCommandOptions) {
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        if (options.contexts) this.contexts = options.contexts;
        else this.contexts = [InteractionContextType.Guild];
        this.aliases = options.aliases;
        this.usage = options.usage;
        this.isAlias = options.isAlias;
        this.flags = options.flags;
        this.execute = options.execute;
        this.argParser = options.argParser;
    }
}

export enum ChatCommandFlags {
    DevOnly = "DevOnly",
    NoSlash = "NoSlash",
    Hidden = "Hidden",
    Ignore = "Ignore",
    NoPrefix = "NoPrefix",
}
export type ChatCommandFlag = `${ChatCommandFlags}`;

export interface ChatCommandArgOptionBase {
    name:string;
    description:string;
    required:boolean;
    type:ApplicationCommandOptionType
    choices?:APIApplicationCommandOptionChoice<string>[]|APIApplicationCommandOptionChoice<number>[];
}

export type ChatCommandArgOption =
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.String; default?: string })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.Integer; default?: number })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.Boolean; default?: boolean })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.User; default?: string })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.Channel; default?: string })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.Role; default?: string })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.Mentionable; default?: string })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.Number; default?: number })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.Attachment; default?: string })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.Subcommand; default?: undefined })
    | (ChatCommandArgOptionBase & { type: ApplicationCommandOptionType.SubcommandGroup; default?: undefined });

export interface ContextCommandOptions {
    name:string,
    description:string,
    type:ContextMenuCommandType,
    context?: InteractionContextType[];
    ignore?:boolean,
    execute: (client: CustomClient, interaction: ContextMenuCommandInteraction) => void,
}

export class ContextCommand {
    public name:string;
    public description:string;
    public type:ContextMenuCommandType;
    public contexts?: InteractionContextType[];
    public ignore?:boolean;
    public execute: (client: CustomClient, interaction: ContextMenuCommandInteraction) => void;

    public constructor(Options: ContextCommandOptions) {
        this.name = Options.name;
        this.description = Options.description;
        this.type = Options.type;
        if (Options.context) this.contexts = Options.context;
        else this.contexts = [InteractionContextType.Guild];
        this.ignore = Options.ignore;
        this.execute = Options.execute;
    }
}
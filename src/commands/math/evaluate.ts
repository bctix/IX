import { ApplicationCommandOptionType, ApplicationIntegrationType, InteractionContextType } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../types/bot_classes';
import { create, all, ConfigOptions } from 'mathjs';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "evaluate",
        description: "Smarts!",
        options: [
            {
                name: "expression",
                description: "erm",
                required: true,
                default: "",
                type: ApplicationCommandOptionType.String,
            },
        ],
        aliases: ["eval"],
        category: "math",
        contexts: [InteractionContextType.PrivateChannel, InteractionContextType.Guild, InteractionContextType.BotDM],
        integrations: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
        argParser(str) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            const expre = command.args[0];

            const config: ConfigOptions = {
                // Default type of number
                // Available options: 'number' (default), 'BigNumber', or 'Fraction'
                number: "BigNumber",
    
                // Number of significant digits for BigNumbers
                precision: 20,
            };
    
            const math = create(all, config);
    
            try {
                const final = math.evaluate(expre);
    
                await command.data.reply(final.toString());
            }
            catch {
                await command.data.reply("Something went wrong trying to solve your problem. Did you type it right?");
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
import { BaseInteraction, ChatInputCommandInteraction, ContextMenuCommandInteraction, Events } from "discord.js";
import { CustomClient, ChatCommandExecute, ChatCommandFlags } from "../../types/bot_types";
import { checkChatFlag, printLine } from "../../utils/utils";

export default {
    name: Events.InteractionCreate,
    async execute(Client: CustomClient, baseInteraction: BaseInteraction) {
        if (baseInteraction.isContextMenuCommand()) {
            const interaction = baseInteraction as ContextMenuCommandInteraction;
            const command = Client.contextmenucommands.get(interaction.commandName);
            if (!command) return;

            try {
                command.execute(Client, interaction);
            }
            catch (e: unknown) {
                await interaction.reply("Something went wrong running the command!");
                printLine("{bold.red There was an error executing the command:} {underline.red " + command.name);
                if (e instanceof Error) printLine(e.message);
            }
        }

        if (baseInteraction.isChatInputCommand()) {
            const interaction = baseInteraction as ChatInputCommandInteraction;
            const command = Client.chatcommands.get(interaction.commandName);
            if (!command) return;

            if (checkChatFlag(command, ChatCommandFlags.Ignore) || checkChatFlag(command, ChatCommandFlags.NoSlash)) return;

            try {
                await command.execute(new ChatCommandExecute(Client, command, interaction));
            }
            catch (e: unknown) {
                await interaction.reply("Something went wrong running the command!");
                printLine("{bold.red There was an error executing the command:} {underline.red " + command.name + "}");
                if (e instanceof Error) printLine(e.stack + "\n");
            }
        }
    },
};
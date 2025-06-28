import { EmbedBuilder, Colors, SendableChannels } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute, ChatCommandFlags } from "../../../types/bot_types";
import { printLine } from "../../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "shutdown",
        description: "Shuts down IX. intended for pm2 to restart it.",
        usage: "Sends back pong!",
        flags: [ChatCommandFlags.DevOnly, ChatCommandFlags.Hidden, ChatCommandFlags.NoSlash],
        category: "misc",
        argParser(str) {
            return [str];
        },
        async execute(execute: ChatCommandExecute) {
            const message = execute.args[0];
            printLine("{bold.red Shutdown command recieved!}");

            const Client = execute.client;
            if (Client.lavalink) {
                for (const player of Client.lavalink.players.values()) {
                    if (player.textChannelId !== null) {
                        const channel = Client.channels.cache.get(player.textChannelId);
                        if (channel?.isSendable()) {
                            const embed = new EmbedBuilder();
                            embed.setTitle("Leaving VC!");
                            if (message !== "") {embed.setDescription(message);}
                            else {embed.setDescription("IX is being shutdown for an update!\nSorry for the inconvenience, She'll be back up shortly.");}
                            embed.setColor(Colors.Red);

                            await (channel as SendableChannels).send({ embeds: [embed] });
                        }
                    }
                    await player.destroy("sigint", true);
                }
            }
            printLine();
            process.exit(0);
        },
    } as ChatCommandOptions,
);

export default textcommand;
import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_types";
import { checkPlayer, commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "textchannel",
        description: "Where am I?",
        aliases: ["tc"],
        usage: "Change the channel where IX sends music related message.",
        category: "music (controls)",
        options: [
            {
                name: "channel",
                description: "The channel to send messages to.",
                type: ApplicationCommandOptionType.Channel,
                required: true,
                default: undefined,
            },
        ],
        argParser(str: string) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            const player = getLavalinkPlayer(commandToLavaData(command));
            if (!checkPlayer(command, player) || !player) return;

            let channel = command.args[0];
            if (channel.id != null) channel = channel.id;
            channel = channel as string;
            channel = channel.replace("<", "").replace(">", "").replace("#", "");

            const realChannel = command.client.channels.cache.get(channel);

            if (!realChannel) {
                command.data.reply("I can't find that channel! Maybe it doesn't exist or I don't have access to it?");
                return;
            }

            if (!realChannel.isTextBased()) {
                command.data.reply("That channel isn't a text channel!");
                return;
            }

            if (realChannel.isDMBased()) {
                command.data.reply("I can't send messages in DMs!");
                return;
            }

            if (realChannel.isVoiceBased()) {
                command.data.reply("I can't send messages in voice channels!");
                return;
            }

            if (realChannel.isThreadOnly() || realChannel.isThread()) {
                command.data.reply("I can't send messages in thread channels!");
                return;
            }

            player.textChannelId = channel;

            command.data.reply({
                content: `Got it! I'll send the messages to <#${channel}> now!`,
                flags: MessageFlags.SuppressEmbeds,
            });
        },
    } as ChatCommandOptions,
);

export default textcommand;
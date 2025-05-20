import { ApplicationCommandOptionType, GuildMember, MessageFlags } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "textchannel",
        description: "Where am I?",
        aliases: ["tc"],
        category: "music (controls)",
        options: [
            {
                name: "channel",
                description: "The channel to send messages to.",
                type: ApplicationCommandOptionType.Channel, // Channel type
                required: true,
                default: null,
            },
        ],
        argParser(str) {
            return [str];
        },
        usage: "Change where IX sends messages related to music.",
        async execute(command: ChatCommandExecute) {
            try {
                let channel = command.args[0];
                if (channel.id != null) channel = channel.id;
                channel = channel as string;
                channel = channel.replace("<", "").replace(">", "").replace("#", "");

                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;
    
                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

                console.log("Channel ID: " + channel);
                const realChannel = command.client.channels.cache.get(channel);
    
                if(!realChannel) {
                    command.data.reply("I can't find that channel! Maybe it doesn't exist or I don't have access to it?");
                    return;
                }

                if(!realChannel.isTextBased()) {
                    command.data.reply("That channel isn't a text channel!");
                    return;
                }

                if(realChannel.isDMBased()) {
                    command.data.reply("I can't send messages in DMs!");
                    return;
                }

                if(realChannel.isVoiceBased()) {
                    command.data.reply("I can't send messages in voice channels!");
                    return;
                }

                if(realChannel.isThreadOnly() || realChannel.isThread()) {
                    command.data.reply("I can't send messages in thread channels!");
                    return;
                }

                player.textChannelId = channel;

                command.data.reply({
                    content: `Got it! I'll send the messages to <#${channel}> now!`,
                    flags: MessageFlags.SuppressEmbeds,
                });

            } catch (e) {
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
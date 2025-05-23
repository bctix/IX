import { ApplicationCommandOptionType,GuildMember } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "skip",
        description: "Dont like this one?",
        aliases: ["s"],
        options: [
            {
                name: "position",
                description: "What song to skip.",
                required: false,
                default: 0,
                type: ApplicationCommandOptionType.Integer,
            },
        ],
        category: "music (controls)",
        usage: "Skip the current song. If a position is given, skip to that song in the queue.",
        argParser(str) {
            const int = Math.round(parseInt(str));
            if (isNaN(int)) return [0];
            return [parseInt(str)];
        },
        async execute(command: ChatCommandExecute) {
            try {
                const position = command.args[0];

                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;

                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

                if (position >= player.queue.tracks.length) {
                    command.data.reply("There is no song at that position!");
                    return;
                }

                await player.skip(position);

                await command.data.reply("Skipped song!");
            } catch (e) {
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
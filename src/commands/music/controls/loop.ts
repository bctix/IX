import { ApplicationCommandOptionType, Colors, EmbedBuilder, GuildMember } from 'discord.js';
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from '../../../types/bot_classes';
import { getLavalinkPlayer, commandToLavaData } from '../../../utils/lavalink';

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "loop",
        description: "Like this one?",
        aliases: ["l"],
        options: [
            {
                name: "position",
                description: "What song to skip.",
                required: true,
                default: 0,
                choices: [
                    { name: "None", value: "none" },
                    { name: "Track", value: "track" },
                    { name: "Queue", value: "queue" },
                ],
                type: ApplicationCommandOptionType.String,
            },
        ],
        category: "music",
        argParser(str) {
            let type = str;
            if (["", "none", "0", "n", "off"].includes(type.toLowerCase())) type = "off";
            if (["s", "track", "1", "single"].includes(type.toLowerCase())) type = "track";
            if (["q", "queue"].includes(type.toLowerCase())) type = "queue";
            return [type];
        },
        async execute(command: ChatCommandExecute) {
            try {
                const loopMode = command.args[0];

                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;

                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

                await player.setRepeatMode(loopMode);

                const embed = new EmbedBuilder()
                    .setTitle("Set loop to " + player.repeatMode)
                    .setColor(Colors.Blurple);

			await command.data.reply({ embeds: [embed] });
            }
            catch (e) {
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
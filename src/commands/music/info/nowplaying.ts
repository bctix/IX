import { Colors, EmbedBuilder, GuildMember, hyperlink, User } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { commandToLavaData, getLavalinkPlayer } from "../../../utils/lavalink";
import { generateProgressBar, getVibrantColorToDiscord, msToTime } from "../../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "nowplaying",
        description: "whar?",
        category: "music (info)",
        aliases: ["np"],
        usage: "Display extra info about the current song.",
        async execute(command: ChatCommandExecute) {
            try {
                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;
    
                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;};
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;};
    
                const track = player.queue.current;
    
                if (!track) {command.data.reply("You are not playing anything!"); return;};

                const embed = new EmbedBuilder();
                embed.setTitle("Now playing:");
                embed.setDescription(hyperlink(track.info.title, track.info.uri));

                embed.addFields(
                    { name: "Artist", value: track.info.author, inline: true },
                    { name: "Source", value: track.info.sourceName, inline: true },
                    { name: "\t", value: "\t", inline: false },
                    { name: "Requestor", value: `<@${(track.requester as User).id}>`, inline: true },
                    { name: "Progress", value: `\`${msToTime(player.position)}\` - ${generateProgressBar(player.position / track.info.duration)} - \`${msToTime(track.info.duration)}\``, inline: false },
                );

                if (track.info.artworkUrl) {
                    embed.setThumbnail(track.info.artworkUrl);
    
                    try {
                        embed.setColor(await getVibrantColorToDiscord(track.info.artworkUrl));
                    } catch {
                        embed.setColor(Colors.Green);
                    }
                }

                await command.data.reply({embeds: [embed]});
            } catch (e) {
                command.data.reply("Something went wrong!");
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
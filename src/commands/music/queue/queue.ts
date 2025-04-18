import { ApplicationCommandOptionType, Colors, EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";
import { msToTime } from "../../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "queue",
        description: "forgor?",
        aliases: ["q"],
        options: [
            {
                name: "page",
                description: "Page in the queue to view.",
                type: ApplicationCommandOptionType.Integer,
                default: 0,
                required: false
            }
        ],
        category: "music (queue)",
        usage: "Displays the current queue for the server.",
        argParser(str: string) {
            const page = Math.round(parseInt(str));
		    return [isNaN(page) ? 1 : page];
        },
        async execute(command: ChatCommandExecute) {
            try {
                let desiredPage = command.args[0] - 1;
    
                const player = getLavalinkPlayer(commandToLavaData(command));
                if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
                const vcId = (command.data.member as GuildMember).voice.channelId;
    
                if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
                if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}
    
                const tracks = player.queue.tracks;
    
                let queuestring = "";
                let queueTime = 0;
    
                const pageCount = Math.ceil((tracks.length + 1) / 10);
                if (desiredPage > pageCount) desiredPage = pageCount;
                if (desiredPage < 0) desiredPage = 0;
    
                const pagedQueue = [];
    
                for (let pageIdx = 0; pageIdx < pageCount; pageIdx++) {
                    const pagelist = [];
                    for (let i = 0; i < 10; i++) {
                        if (tracks[i + pageIdx * 10] == null) break;
                        const track = tracks[i + pageIdx * 10];
                        queueTime += track.info.duration ? track.info.duration : 0;
                        pagelist.push(track);
                    }
                    pagedQueue.push(pagelist);
                }
    
                for (let i = 0; i < pagedQueue[desiredPage].length; i++) {
                    let songNumber = i + desiredPage * 10;
                    if (desiredPage >= 1) songNumber++; 
                    const songTrack = pagedQueue[desiredPage][i];
                    queuestring += `${songNumber}. [${songTrack.info.title}${songTrack.info.author ? ` - ${songTrack.info.author}` : "Unknown"}](${songTrack.info.uri})\n`;
                }
    
                if (queuestring.length == 0) queuestring = "None!";
                const queueEmbed = new EmbedBuilder()
                    .setTitle("Queue:")
                    .setDescription(
                        `\`Page ${desiredPage + 1} / ${pagedQueue.length}\` (${tracks.length} songs...)\n\n${queuestring}`,
                    )
                    .setFooter({ text: `Loop: ${player.repeatMode} | Queue history: ${player.queue.previous.length} | Queue length: ${msToTime(queueTime)}`})
                    .setColor(Colors.Purple);
    
                await command.data.reply({ embeds:[queueEmbed] });
            } catch (e) {
                console.error(e);
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
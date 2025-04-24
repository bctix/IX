import { EmbedBuilder, GuildMember } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";
import { getVibrantColorToDiscord } from "../../../utils/utils";

type LyricsResponse = {
    id: number,
    name: string,
    trackName: string,
    artistName: string,
    plainLyrics: string
};

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "lyrics",
        description: "Say that again?",
        category: "music (info)",
        aliases: ["ly"],
        usage: "Display the lyrics of the current song, if available.",
        argParser(str) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
           try {
            const player = getLavalinkPlayer(commandToLavaData(command));
			if (!command.data.member) {command.data.reply("I couldn't get what vc you're in!"); return;};
			const vcId = (command.data.member as GuildMember).voice.channelId;

			if (!player) {command.data.reply("I couldn't get what vc you're in!"); return;}
			if (player.voiceChannelId !== vcId) {command.data.reply("You need to be in my vc!"); return;}

			const track = player.queue.current;

			if (!track) {command.data.reply("There is nothing playing!"); return;}

            const response = await fetch(`https://lrclib.net/api/search?q=${track.info.title.replace(" ", "+")}+${track.info.author.replace(" ", "+")}`, {
				headers: {
					"User-Agent": "https://github.com/bctix/IX",
				},
			});

            if (!response.ok) { command.data.reply("Something went wrong getting the lyrics!"); return; }

            const resJson = await response.json() as LyricsResponse[];
            if (!resJson) { command.data.reply("Couldn't find any lyrics for the song!"); return; }

            let lyricsData: LyricsResponse | undefined = resJson.find((data: LyricsResponse) => { return data.trackName === track.info.title; });
            
            // if there is no exact match, use first result. may be incorrect.
            // this is a fallback in case the song does have lyrics but the title is different.
            if (!lyricsData) lyricsData = resJson[0];

			if (!lyricsData) { command.data.reply("Couldn't find any lyrics for your song!"); return; }

            const lyrics = lyricsData.plainLyrics;
			const embed = new EmbedBuilder()
				.setTitle(`Lyrics for ${lyricsData.trackName} - ${lyricsData.artistName}`)
				.setDescription(lyrics);

			if (track.info.artworkUrl) {
				embed.setThumbnail(track.info.artworkUrl);
				embed.setColor(await getVibrantColorToDiscord(track.info.artworkUrl));
			}

			await command.data.reply({ embeds: [embed] });
           } catch (e) {
            command.data.reply("Something went wrong.");
            console.error(e);
           }
        },
    } as ChatCommandOptions
);

export default textcommand;
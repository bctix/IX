import { ApplicationCommandOptionType, StringSelectMenuBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../../types/bot_classes";
import { getLavalinkPlayer, commandToLavaData } from "../../../utils/lavalink";
import { printLine } from "../../../utils/utils";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "search",
        description: "forgor",
        options: [
            {
                name: "query",
                description: "Song title.",
                type: ApplicationCommandOptionType.String,
                default: "",
                required: true
            }
        ],
        usage: "Searches Youtube Music for songs, and lets you select from a list.",
        argParser(str) {
            return [str];
        },
        async execute(command: ChatCommandExecute) {
            const query = command.args[0] as string;
            
            if (!query || query.trim() === "") {
                return command.data.reply("Please provide a search query.");
            }

            try {
                const player = getLavalinkPlayer(commandToLavaData(command));

                // Check if the player exists. (User is in a voice channel)
                if(!player) {
                    return command.data.reply("I couldn't get what vc you are in.");
                }

                // Attempt to search for the song or URL provided by the user
                const searchResult = await player.search({query: query, source: "ytmsearch"}, command.data.member?.user);

                // Check if the search result is valid and contains tracks
                if (!searchResult || !searchResult.tracks?.length) {
                    await command.data.reply("Couldn't find any songs!");
                    return;
                }

                const dropdown = new StringSelectMenuBuilder();
                dropdown.setPlaceholder("Select a song!");
                dropdown.setCustomId("songPicker");
                
                for (let index = 0; index < 9; index++) {
                    const track = searchResult.tracks[index];
                    if (!track) continue;
                    if (track.info.uri)
                        dropdown.addOptions(
                            // There is a title size limit of 100 characters
                            {label: `${track.info.title.length > 25 ? track.info.title.slice(0, 25) + "..." : track.info.title} - ${track.info.author}`, value: track.info.uri}
                        );
                }
                
                const container = new ContainerBuilder();
                container.addTextDisplayComponents(new TextDisplayBuilder({content:"## Select a song!"}));
                container.addActionRowComponents(row => row.addComponents(dropdown));

                const message = await command.data.reply({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                });

                const collector = message.createMessageComponentCollector({ filter: (i) => i.user.id === command.data.member?.user.id, time: 60_000 });

                collector.on("collect", async (i) => {
                    if (!player) {
                        dropdown.setDisabled(true);
                        await i.update({components: [container]});
                        return;
                    }

                    if (i.isStringSelectMenu()) {
                        const selectedURL = i.values[0];
                        
                        const songres = await player.search(selectedURL, command.data.member?.user);
                        const track = songres.tracks[0];

                        player.queue.add(track);

                        const wasPlaying = player.connected;
                        
                       // Connect to the voice channel if not already connected
                       if (!player.connected) await player.connect();
                       
                       // Add the track(s) to the player's queue
                       await player.queue.add(
                           // If the loadType is a playlist, add all the tracks; otherwise, add the first track
                           searchResult.loadType === "playlist" ? searchResult.tracks : searchResult.tracks[0],
                       );
                       
                       // If the player was not playing before, start playback
                       if (!player.playing) await player.play();
                       
                       // Only send a confirmation message if the player is already playing. that means it was added to the queue.
                       if (wasPlaying) {
                           await command.data.reply("Added to queue!");
                       } else if (!command.isMessage) {await (command.data as ChatInputCommandInteraction).reply({ content: "Playing your song", flags: MessageFlags.Ephemeral });}

                        await message.delete();
                        return;
                    }
                });
            } catch (error) {
                printLine(`{bold.red There was an error while trying to play a song: } \n{red ${error}}`);
                return command.data.reply("An error occurred while trying to play the song.");
            }
        },
    } as ChatCommandOptions
);

export default textcommand;
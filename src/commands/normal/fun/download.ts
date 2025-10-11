import { ChatCommand, ChatCommandOptions, ChatCommandExecute, ChatCommandFlags } from "../../../types/bot_types";
import { ApplicationCommandOptionType, hyperlink } from "discord.js";
import { cobaltApiKey, cobaltLink } from "../../../utils/constants";
import psl from "@imput/psl";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "download",
        description: "download a video using cobalt!",
        usage: "Lets you download a video!",
        category: "fun",
        options: [
            {
                name: "url",
                description: "The URL of the video you wish to download",
                default: "",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "download_mode",
                description: "The way you want your file to be",
                default: "auto",
                choices: [
                    {
                        name: "Auto",
                        value: "auto",
                    },
                    {
                        name: "Audio Only",
                        value: "audio",
                    },
                    {
                        name: "Muted",
                        value: "mute",
                    },
                ],
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "video_quality",
                description: "The quality of the video. (if not possible, it gets next best thing.)",
                default: "1080",
                choices: [
                    {
                        name: "Max",
                        value: "max",
                    },
                    {
                        name: "4320",
                        value: "4320",
                    },
                    {
                        name: "2160",
                        value: "2160",
                    },
                    {
                        name: "1440",
                        value: "1440",
                    },
                    {
                        name: "1080",
                        value: "1080",
                    },
                    {
                        name: "720",
                        value: "720",
                    },
                    {
                        name: "480",
                        value: "480",
                    },
                    {
                        name: "360",
                        value: "360",
                    },
                    {
                        name: "240",
                        value: "240",
                    },
                    {
                        name: "140",
                        value: "140",
                    },
                ],
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "audio_format",
                description: "The audio format",
                default: "mp3",
                choices: [
                    {
                        name: "Best",
                        value: "best",
                    },
                    {
                        name: "MP3",
                        value: "mp3",
                    },
                    {
                        name: "ogg",
                        value: "ogg",
                    },
                    {
                        name: "wav",
                        value: "wav",
                    },
                    {
                        name: "opus",
                        value: "opus",
                    },
                ],
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "convert_gif",
                description: "Converts twitter gifs to actually be gifs",
                type: ApplicationCommandOptionType.Boolean,
                default: true,
                required: false,
            },
            {
                name: "tiktok_audio",
                description: "Downloads the original sound used in the video.",
                type: ApplicationCommandOptionType.Boolean,
                default: false,
                required: false,
            },
        ],
        flags: [ChatCommandFlags.NoPrefix],
        async execute(command: ChatCommandExecute) {
            const url = command.args[0];
            const downloadMode = command.args[1];
            const videoQuality = command.args[2];
            const audioFormat = command.args[3];
            const convertGif = command.args[4];
            const tiktokAudio = command.args[5];

            const parsed = processUrl(new URL(url));

            if (!parsed) {
                await command.data.reply("An unknown error has occured! Try again later.");
                return;
            }

            const res = await fetch(cobaltLink, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Api-Key ${cobaltApiKey}`,
                },
                body: JSON.stringify({
                    "url": url,
                    "videoQuality": videoQuality,
                    "downloadMode": downloadMode,
                    "audioFormat": audioFormat,
                    ...(parsed.host === "twitter.com" && { "convertGif": convertGif }),
                    ...(parsed.host === "tiktok.com" && { "tiktokAudio": tiktokAudio }),
                }),
            });

            console.log(JSON.stringify({
                "url": url,
                "videoQuality": videoQuality,
                "downloadMode": downloadMode,
                "audioFormat": audioFormat,
                ...(parsed.host === "twitter.com" && { "convertGif": convertGif }),
                ...(parsed.host === "tiktok.com" && { "tiktokAudio": tiktokAudio }),
            }));


            const data = await res.json();

            if (!res.ok) {
                if (data.status === "error" && data.error.code === "error.api.link.invalid") {
                    await command.data.reply("That link is not a valid link! It may not be a service I can download from. (example: spotify)");
                }
                else {
                    console.log(data);
                    await command.data.reply("An unknown error has occured! Try again later.");
                }
                return;
            }

            await command.data.reply(`Here is your download link to download:\n\`${data.filename}\`:\n\n${hyperlink("Download here!", data.url)} (it will open in your browser)`);
        },
    } as ChatCommandOptions,
);

function processUrl(url: URL) {
    const host = psl.parse(url.hostname);
    const parts = url.pathname.split("/");

    if (host.error || !host.domain) return null;

    switch (host.sld) {
        case "youtube":
            if (url.pathname.startsWith("/live/") || url.pathname.startsWith("/shorts/")) {
                url.pathname = "/watch";
                // parts := ['', 'live' || 'shorts', id, ...rest]
                url.search = `?v=${encodeURIComponent(parts[2])}`;
            }
            break;

        case "youtu":
            if (url.hostname === "youtu.be" && parts.length >= 2) {
                /* youtu.be urls can be weird, e.g. https://youtu.be/<id>//asdasd// still works
                ** but we only care about the 1st segment of the path */
                url = new URL(`https://youtube.com/watch?v=${
                    encodeURIComponent(parts[1])
                }`);
            }
            break;

        case "pin":
            if (url.hostname === "pin.it" && parts.length === 2) {
                url = new URL(`https://pinterest.com/url_shortener/${
                    encodeURIComponent(parts[1])
                }`);
            }
            break;

        case "vxtwitter":
        case "fixvx":
        case "x":
            if (["x.com", "vxtwitter.com", "fixvx.com"].includes(url.hostname)) {
                url.hostname = "twitter.com";
            }
            break;

        case "twitch":
            if (url.hostname === "clips.twitch.tv" && parts.length >= 2) {
                url = new URL(`https://twitch.tv/_/clip/${parts[1]}`);
            }
            break;

        case "bilibili":
            if (host.tld === "tv") {
                url = new URL(`https://bilibili.com/_tv${url.pathname}`);
            }
            break;

        case "b23":
            if (url.hostname === "b23.tv" && parts.length === 2) {
                url = new URL(`https://bilibili.com/_shortLink/${parts[1]}`);
            }
            break;

        case "dai":
            if (url.hostname === "dai.ly" && parts.length === 2) {
                url = new URL(`https://dailymotion.com/video/${parts[1]}`);
            }
            break;

        case "facebook":
        case "fb":
            if (url.searchParams.get("v")) {
                url = new URL(`https://web.facebook.com/user/videos/${url.searchParams.get("v")}`);
            }
            if (url.hostname === "fb.watch") {
                url = new URL(`https://web.facebook.com/_shortLink/${parts[1]}`);
            }
            break;

        case "ddinstagram":
            if (["ddinstagram.com"].includes(host.domain) && [null, "d", "g"].includes(host.subdomain)) {
                url.hostname = "instagram.com";
            }
            break;

        case "vk":
        case "vkvideo":
            if (["vkvideo.ru", "vk.ru"].includes(url.hostname)) {
                url.hostname = "vk.com";
            }
            if (url.searchParams.get("z")) {
                url = new URL(`https://vk.com/${url.searchParams.get("z")}`);
            }
            break;

        case "xhslink":
            if (url.hostname === "xhslink.com" && parts.length === 3) {
                url = new URL(`https://www.xiaohongshu.com/${parts[1]}/${parts[2]}`);
            }
            break;

        case "loom": {
            const idPart = parts[parts.length - 1];
            if (idPart.length > 32) {
                url.pathname = `/share/${idPart.slice(-32)}`;
            }
            break;
        }
        case "redd":
            /* reddit short video links can be treated by changing https://v.redd.it/<id>
            to https://reddit.com/video/<id>.*/
            if (url.hostname === "v.redd.it" && parts.length === 2) {
                url = new URL(`https://www.reddit.com/video/${parts[1]}`);
            }
            break;
    }

    return url;
}

export default textcommand;
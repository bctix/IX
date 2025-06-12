import { template } from "./chalk";
import { client } from "../index";
import json5 from "json5";
import { readFileSync } from "fs";
import path from "path";
import { ChatCommand, ChatCommandFlag } from "../types/bot_types";
import { ColorResolvable, EmbedBuilder, resolveColor } from "discord.js";
import Vibrant from "node-vibrant/node";

// ------- Logging Functions -------- //

export function print(message?: string) {
    if (message) process.stdout.write(template(message));
}

export function printLine(message?: string) {
    if (!message) process.stdout.write("\n");
    else process.stdout.write("\n" + template(message));
}

export function clearLine() {
    process.stdout.write("\r\x1b[K");
}

// -------- Emoji Functions --------- //

export function getEmojiFromName(name :string) : string {
    if (!client) { throw new Error("Client is not initialized!"); }
    const emoji = client.emojis.cache.find((emoj) => emoj.name === name);
    if (!emoji) { return ""; }
    return emoji.toString();
}

// -------- File Functions --------- //

export const RootPath:string = path.join(__dirname, "..", "..");

export function parseJson5(filepath: string) {
    // path to config.json5 from entry point
    const text = readFileSync(path.join(RootPath, filepath));

    return json5.parse(text.toString());
}

// ------ Command Functions ------- //

export function checkChatFlag(cmdModule: ChatCommand, flag: ChatCommandFlag) {
    return cmdModule.flags == flag || cmdModule.flags?.includes(flag);
}

// ------- Misc Functions -------- //

export function createErrorEmbed(message: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor("Red")
        .setTitle("An error has occurred")
        .setDescription(message);
}

export function generateProgressBar(percentage: number, size = 10, emptyText = "▱", filledText = "▰") {
	const filledCount = Math.floor(percentage * size);
	const emptyCount = size - filledCount;
	return filledText.repeat(filledCount) + emptyText.repeat(emptyCount);
}

/**
 * getVibrantColorToDiscord
 * Returns a color based on the vibrant color of an image.
 * @param {string} imagePath - The path to the image.
 * @returns {number} Resolved color for discord
 */
export async function getVibrantColorToDiscord(imagePath: string): Promise<number | null> {
    // yeah ok Vibrant.Vibrant sure okay yeaeh its still funny we keep it
    const palette = await Vibrant.Vibrant.from(imagePath).getPalette();
    let color: string | null = null;

    if (!palette.Vibrant || !palette.LightVibrant) { return color; }

    if (palette.Vibrant?.population > palette.LightVibrant?.population) {
        color = palette.Vibrant.hex;
    }
    else {
        color = palette.LightVibrant.hex;
    }

    return resolveColor(color as ColorResolvable) ?? null;
}

// --------- Math functions --------- //

/**
 * msToTime
 * Converts milliseconds to a time string in the format of HH:MM:SS.
 * @param {number} s - The time in milliseconds.
 * @returns {string} The time string in the format of HH:MM:SS.
 */
export function msToTime(s: number) {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;
    let str = "";
    if (hrs !== 0) {str += (hrs < 10 ? "0" + hrs + ":" : hrs + ":");}
    str += (mins < 10 ? "0" + mins + ":" : mins + ":");;
    if (secs < 10) str += "0";
    str += secs;
    return str;
}
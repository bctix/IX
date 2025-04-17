import { template } from "./chalk"
import { resolveColor, ColorResolvable } from "discord.js";
import Vibrant from "node-vibrant/node";

// ------- Logging Functions -------- //
export function print(message?: string) {
	if(message) process.stdout.write(template(message));
}

export function printLine(message?: string) {
	if (!message) process.stdout.write("\n");
	else process.stdout.write("\n"+template(message));
}

export function clearLine() {
	process.stdout.write("\r\x1b[K");
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

// --------- Misc functions --------- //

export function parseBool(str: string | undefined): boolean {
	if (!str) return false;
	if (str.toLowerCase() === "true") { return true; }
	else if (str.toLowerCase() === "false") { return false; }
	else { throw new Error("Invalid boolean string"); }
}

/**
 * getVibrantColorToDiscord
 * Returns a color based on the vibrant color of an image.
 * @param {string} imagePath - The path to the image.
 * @returns {number} Resolved color for discord
 */
export async function getVibrantColorToDiscord(imagePath: string): Promise<number | null> {
	// yeah ok Vibrant.Vibrant sure okay yeaeh its funny we keep it
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

export function generateProgressBar(percentage: number, size = 10, emptyText = "▱", filledText = "▰") {
	const filledCount = Math.floor(percentage * size);
	const emptyCount = size - filledCount;
	return filledText.repeat(filledCount) + emptyText.repeat(emptyCount);
}
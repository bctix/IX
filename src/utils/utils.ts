import { resolveColor, ColorResolvable } from "discord.js";
import Vibrant from "node-vibrant/node";
import chalk, { Chalk } from "chalk";

// ------- Logging Functions -------- //

const styles: Record<string, keyof typeof chalk> = {
	b: "blue",
	i: "italic",
	y: "yellow",
	r: "red",
	g: "green",
	bold: "bold",
	u: "underline"
  };

function colorizeStringSingleTag(inputString: string) {
	let outputString = "";
	let currentStyle = chalk.reset;
  
	for (let i = 0; i < inputString.length; i++) {
	  if (inputString.startsWith("<", i) && inputString.includes(">", i)) {
		const closingTagIndex = inputString.indexOf(">", i);
		const tag = inputString.substring(i + 1, closingTagIndex);
  
		if (Object.prototype.hasOwnProperty.call(styles, tag)) {
		  const style = chalk[styles[tag] as keyof typeof chalk];
		  currentStyle = typeof style === "function" ? (style as Chalk) : chalk.reset; 
		  i = closingTagIndex;
		} else if (tag === "r") {
		  currentStyle = chalk.reset;
		  i = closingTagIndex;
		} else {
		  // Treat unknown tags as plain text
		  outputString += inputString[i];
		}
	  } else {
		outputString += currentStyle(inputString[i]);
	  }
	}
  
	return outputString;
}

export function print(message?: string) {
	if(message) process.stdout.write(colorizeStringSingleTag(message));
}

export function printLine(message?: string) {
	if (!message) process.stdout.write("\n");
	else process.stdout.write("\n"+colorizeStringSingleTag(message));
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
	if (hrs !== 0) {str += hrs + ":";}
	str += mins + ":";
	if (secs < 10) str += "0";
	str += secs;
	return str;
}

// --------- Misc functions --------- //

export function parseBool(str: string): boolean {
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
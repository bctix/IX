import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------- Path functions --------- //

/**
 * Returns the root directory of the project.
 * @returns {string} The root directory path.
 */
export function getRootDir() {
	return path.join(__dirname, "../../");
}

/**
 * Returns the path to an image asset.
 * @param {string} imageKey - The key of the image asset.
 * @returns {string} The path to the image asset.
 */
export function getImage(imageKey: string) {
	return path.join(getRootDir(), "assets/images/" + imageKey);
}

/**
 * Returns the path to a font asset.
 * @param {string} fontKey - The key of the font asset.
 * @returns {string} The path to the font asset.
 */
export function getFont(fontKey: string) {
	return path.join(getRootDir(), "assets/fonts/" + fontKey);
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

export function generateProgressBar(percentage: number, size = 10, emptyText = "▱", filledText = "▰") {
	const filledCount = Math.floor(percentage * size);
	const emptyCount = size - filledCount;
	return filledText.repeat(filledCount) + emptyText.repeat(emptyCount);
}
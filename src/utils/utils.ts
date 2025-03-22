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
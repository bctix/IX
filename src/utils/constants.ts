export const devs: string[] = ["205580500125876224"];
export const prefix: string = process.env.NODE_ENV == "production" ? "ix!" : "xi!";
export const author: string = "bctix";
import packageData from "../../package.json";
export const version: string = packageData.version;
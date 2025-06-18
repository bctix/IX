import { LavalinkConfig } from "../types/bot_types";
import { parseJson5 } from "./utils";
import packageData from "../../package.json";
const config = parseJson5("config/config.json5");

export const devs: string[] = config.devs;
export const prefix: string = process.env.NODE_ENV === "production" ? config.prefix : config.devprefix;
export const version: string = packageData.version;
export const lavalinkConfig: LavalinkConfig = config.lavalink;

export const enableMusic: boolean = config.enableMusic ?? true;
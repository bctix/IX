import { LavalinkConfig } from "../types/bot_types";
import { parseJson5 } from "./utils";
const config = parseJson5("config/config.json5");

export const devs: string[] = config.devs;
export const prefix: string = process.env.NODE_ENV === "production" ? config.prefix : config.devprefix;

export const lavalinkConfig: LavalinkConfig = config.lavalink;
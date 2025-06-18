import { randomInt } from "mathjs";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_types";
import { ApplicationCommandOptionType } from "discord.js";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "roll",
        description: "RNG",
        usage: "Sends a number between 1 - 6, or your selected min and max numbers. If one number is given, it is used as the maximum.",
        options: [
            {
                name: "min",
                description: "Minimum number that can be rolled.",
                type: ApplicationCommandOptionType.Integer,
                default: 1,
                required: false,
            },
            {
                name: "max",
                description: "Maximum number that can be rolled.",
                type: ApplicationCommandOptionType.Integer,
                default: 6,
                required: false,
            },
        ],
        argParser(str) {
            const split = str.split(" ");
            const minNumber = parseInt(split[0]);
            const maxNumber = parseInt(split[1]);

            if (!maxNumber) return [1, isNaN(minNumber) ? 6 : minNumber];
            else return [isNaN(minNumber) ? 1 : minNumber, isNaN(maxNumber) ? 6 : maxNumber];
        },
        async execute(command: ChatCommandExecute) {
            const minNumber = command.args[0];
            const maxNumber = command.args[1];

            const number = randomInt(minNumber, maxNumber + 1);

            await command.data.reply(`${number}\n-# Rolled between ${minNumber} - ${maxNumber}`);
        },
    } as ChatCommandOptions,
);

export default textcommand;
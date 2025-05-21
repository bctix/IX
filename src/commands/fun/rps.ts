import { ApplicationCommandOptionType } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_classes";
import { randomInt } from "mathjs";

const choices = ["rock", "paper", "scissors"];
const outcomes = [
    ["It's a draw.", "I win!", "You win!"], // ix picks is rock
    ["You win!", "It's a draw.", "I win!"], // ix picks is paper
    ["I win!", "You win!", "It's a draw."] // ix picks is scissors
  ];

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "rps",
        description: "How fun!",
        aliases: ["rockpaperscissors"],
        category: "fun",
        usage: "Play simple game of rock paper scissors with IX!",
        options: [
            {
                name: "move",
                description: "Minimum number that can be rolled.",
                type: ApplicationCommandOptionType.String,
                default: "rock",
                choices: [
                    { name: "rock", value: "0" },
                    { name: "paper", value: "1" },
                    { name: "scissors", value: "2" },
                ],
                required: true,
            }
        ],
        argParser(str) {
            if(!choices.includes(str.split(" ")[0].toLowerCase())) {
                return [-1];
            }
            return [choices.indexOf(str.split(" ")[0])];
        },
        async execute(command: ChatCommandExecute) {
            const move = command.args[0];

            if(move == -1) {
                command.data.reply("Please provide a valid move! (rock, paper, scissors)");
                return;
            }

            const ixMove = randomInt(0, choices.length);
            const result = outcomes[ixMove][move];

            await command.data.reply(
                `I pick **${choices[ixMove]}**! And you picked **${choices[move]}**!\n${result}`
            );
        },
    } as ChatCommandOptions
);

export default textcommand;
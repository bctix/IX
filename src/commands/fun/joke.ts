import { fetch } from "undici";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../types/bot_classes";
import { EmbedBuilder } from "discord.js";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "joke",
        description: "some funnies",
        category: "fun",
        usage: "Sends a random joke.",
        argParser(str) {
            return [str];
        },
        async execute(execute: ChatCommandExecute) {
           const req = await fetch("https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
           
           const json = await req.json() as { joke: string, setup: string, delivery: string, type: string, safe: boolean };

           const embed = new EmbedBuilder();
           embed.setTitle("Joke :P");
           embed.setColor("Random");
           if (json.type === "single") {
               embed.setDescription(json.joke);
           } else if (json.type === "twopart") {
               embed.setDescription(json.setup);
           }
           const message = await execute.data.reply({ embeds: [embed] });

           if (json.type === "twopart") {
               setTimeout(async () => {
                    embed.setColor("Random");
                    embed.setDescription(json.setup + "\n" + json.delivery);
                    await message.edit({ embeds: [embed] });
               }, 3000);
           }
           
        },
    } as ChatCommandOptions
);

export default textcommand;
import { ApplicationCommandOptionType, Attachment, Message } from "discord.js";
import { ChatCommand, ChatCommandOptions, ChatCommandExecute } from "../../../types/bot_classes";
import globalplay from "./globalplay";

const textcommand: ChatCommand = new ChatCommand(
    {
        name: "file",
        description: "Play some tunes!",
        usage: "Identical to `play` but plays an uploaded file.",
        options: [
            {
                name: "file",
                description: "audio file to play",
                type: ApplicationCommandOptionType.Attachment,
                default: "",
                required: true
            }
        ],
        category: "music (play)",
        async execute(command: ChatCommandExecute) {
            let attachment: Attachment | undefined;
            if (command.isMessage) 
                attachment = (command.data as Message).attachments.first();
             else 
                attachment = command.args[0] as Attachment;
            
            if (!attachment) {
                command.data.reply("Please provide a valid audio file!");
                return;
            }
            if (!attachment.url) {
                command.data.reply("Please provide a valid audio file!");
                return;
            }
           
            globalplay.playFile(command, attachment, "ytmsearch");
        },
    } as ChatCommandOptions
);

export default textcommand;
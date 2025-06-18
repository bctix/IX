import { ApplicationCommandOptionType, Attachment, Message } from "discord.js";
import { ChatCommand, ChatCommandExecute, ChatCommandOptions } from "../../types/bot_types";
import { playSong } from "../../utils/lavalink";

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
                required: true,
            },
        ],
        category: "music (play)",
        async execute(command: ChatCommandExecute) {
            let attachment: Attachment | undefined;
            if (command.isMessage) { attachment = (command.data as Message).attachments.first(); }
            else { attachment = command.args[0] as Attachment; }

            if (!attachment) {
                command.data.reply("Couldn't find any attachment! Make sure you upload the song file along with the command!");
                return;
            }

            await playSong(command, attachment.url, "ytmsearch", { title: attachment.name });
        },
    } as ChatCommandOptions,
);

export default textcommand;
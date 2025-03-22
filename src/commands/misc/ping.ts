import { ChatCommand, ChatCommandExecute } from "../../types/bot_types.d";

const textcommand: ChatCommand = new ChatCommand();
textcommand.name = "ping";
textcommand.description = "Pong!";
textcommand.execute = (command: ChatCommandExecute) => {
	command.data.reply("Pong!");
};

export default textcommand;
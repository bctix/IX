/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { ChatCommand, CustomClient } from "../types/bot_types";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import { ApplicationCommandOptionType, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerTextCommands(client:CustomClient, ...dirs: string[]) {
	dirs.forEach(async (dir) => {
		const files = await fs.promises.readdir(path.join(__dirname, dir));

		for (const idx in files) {
			const file = files[idx];
			const stat = await fs.promises.lstat(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {registerTextCommands(client, path.join(dir, file));}
			else {
				if (!file.endsWith(".ts")) continue;
				const fileName = file.substring(0, file.indexOf(".ts"));
				const cmdModule = (await import(pathToFileURL(path.join(__dirname, dir, fileName)).toString())).default as ChatCommand;

				if (cmdModule.ignore) {
					continue;
				}

				if (!cmdModule.name) {
					console.warn(`The command '${path.join(__dirname, dir, file)}' doesn't have a name`);
					continue;
				}

				if (!cmdModule.execute) {
					console.warn(`The command '${cmdModule.name}' doesn't have an execute function`,
					);
					continue;
				}

				if (client.chatcommands.has(cmdModule.name)) {
					console.warn(`The command name '${cmdModule.name}' has already been added.`);
					continue;
				}

				client.chatcommands.set(cmdModule.name, cmdModule);

				if (cmdModule.aliases && cmdModule.aliases.length !== 0) {
					cmdModule.aliases.forEach((alias: string) => {
						if (client.chatcommands.has(alias)) {
							console.warn("WARNING", "src/registry.ts", `The command alias '${alias}' has already been added.`);
						}
						else {
							const cmdClone = Object.assign({}, cmdModule);
							cmdClone.isAlias = true;
							client.chatcommands.set(alias, cmdClone);
						}
					});
				}
			}
		}
	});
}

export async function registerEvents(EventClient: any, ExecuteClient: CustomClient, ...dirs: string[]) {
	dirs.forEach(async (dir) => {
		const files = await fs.promises.readdir(path.join(__dirname, dir));

		for (const idx in files) {
			const file = files[idx];
			const stat = await fs.promises.lstat(path.join(__dirname, dir, file));
			if (stat.isDirectory()) { await registerEvents(EventClient, ExecuteClient, ...dirs); }
			else {
				if (!file.endsWith(".ts")) continue;
				const fileName = file.substring(0, file.indexOf(".ts"));
				const eventModule = (await import(pathToFileURL(path.join(__dirname, dir, fileName)).toString())).default;
				if (eventModule.once) { EventClient.once(eventModule.name, (...args: any) => eventModule.execute(ExecuteClient, ...args));};
				EventClient.on(eventModule.name, (...args: any) => eventModule.execute(ExecuteClient, ...args));
			}
		}
	});
}

export async function removeSlashCommands(client:CustomClient) {
	if (!client.token || !client.user) {
		console.warn("Failed to get client data! Unable to remove slash commands!");
		return;
	}

	const rest = new REST().setToken(client.token);

	try {
		await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: [] },
		);
	}
	catch (error) {
		console.error(error);
	}
}

export async function deploySlashCommands(client:CustomClient) {
	if (!client.token || !client.user) {
		console.warn("Failed to get client data! Unable to deploy slash commands!");
		return;
	}

	const rest = new REST().setToken(client.token);

	try {
		const builtCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

		client.chatcommands.forEach(command => {
			if (command.noSlash) return;
			if (command.isAlias) return;

			const slashCommand = new SlashCommandBuilder();
			slashCommand.setName(command.name);
			slashCommand.setDescription(command.description);

			if (command.options && command.options.length > 0) {
				command.options.forEach(commandOption => {
					switch (commandOption.type) {
					case (ApplicationCommandOptionType.String): {
						slashCommand.addStringOption((option) => {
							option.setName(commandOption.name);
							option.setDescription(commandOption.description);
							if (commandOption.required) {option.setRequired(commandOption.required);}
							if (commandOption.choices) {option.addChoices(commandOption.choices);}

							return option;
						});
						break;
					}
					case (ApplicationCommandOptionType.Boolean): {
						slashCommand.addNumberOption((option) => {
							option.setName(commandOption.name);
							option.setDescription(commandOption.description);
							if (commandOption.required) {option.setRequired(commandOption.required);}

							return option;
						});
						break;
					}
					case (ApplicationCommandOptionType.Number): {
						slashCommand.addNumberOption((option) => {
							option.setName(commandOption.name);
							option.setDescription(commandOption.description);
							if (commandOption.required) {option.setRequired(commandOption.required);}

							return option;
						});
						break;
					}
					case (ApplicationCommandOptionType.Integer): {
						slashCommand.addIntegerOption((option) => {
							option.setName(commandOption.name);
							option.setDescription(commandOption.description);
							if (commandOption.required) {option.setRequired(commandOption.required);}

							return option;
						});
						break;
					}
					case (ApplicationCommandOptionType.Attachment): {
						slashCommand.addAttachmentOption((option) => {
							option.setName(commandOption.name);
							option.setDescription(commandOption.description);
							if (commandOption.required) {option.setRequired(commandOption.required);}

							return option;
						});
						break;
					}
					}
				});
			}

			builtCommands.push(slashCommand.toJSON());
		});

		await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: builtCommands },
		);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}
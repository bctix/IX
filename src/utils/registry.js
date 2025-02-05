const fs = require('fs').promises;
const path = require('path');
const { log } = require("./utils.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST, Routes } = require('discord.js');

async function registerCommands(client, ...dirs) {
    for(const dir of dirs) {
        let files = (await fs.readdir(path.join(__dirname, dir)));

        for(let file of files) {
            let stat = await fs.lstat(path.join(__dirname, dir, file));
            if(stat.isDirectory())
                await registerCommands(client, path.join(dir, file));
            else {
                if(!file.endsWith(".js")) continue;
                try {
                    if(require.cache[require.resolve(path.join(__dirname, dir, file))])
                        delete require.cache[require.resolve(path.join(__dirname, dir, file))];
                    let cmdModule = require(path.join(__dirname, dir, file));
                    if(cmdModule.isNotCommand) continue;
                    let { name, description, options, aliases, category, execute, hideCommand } = cmdModule;
    
                    if (!name) {
                        log("WARNING", "src/registry.js", `The command '${path.join(__dirname, dir, file)}' doesn't have a name`);
                        continue;
                    }
    
                    if(!description) {
                        log("WARNING", "src/registry.js", `The command '${path.join(__dirname, dir, file)}' doesn't have a description`);
                        continue;
                    }
    
                    if (!execute) {
                        log("WARNING", "src/registry.js", `The command '${name}' doesn't have an execute function`);
                        continue;
                    }
    
                    if (client.commands.has(name)) {
                        log("WARNING", "src/registry.js", `The command name '${name}' has already been added.`);
                        continue;
                    }
    
                    client.commands.set(name, cmdModule);

                    if(aliases && aliases.length !== 0) {
                        aliases.forEach(alias => {
                            if (client.commandaliases.has(alias)) {
                                log("WARNING", "src/registry.js", `The command alias '${alias}' has already been added.`);
                            } else client.commandaliases.set(alias, cmdModule);
                        });
                    }
    
                    if (hideCommand) continue;
    
                    if (category) {
                        let commands = client.categories.get(category.toLowerCase());
                        if (!commands) commands = [category];
                        commands.push(name);
                        client.categories.set(category.toLowerCase(), commands);
                    } else {
                        log("WARNING", "src/registry.js", `The command '${name}' doesn't have a category, it will default to 'No category'.`);
                        let commands = client.categories.get('no category');
                        if (!commands) commands = ['No category'];
                        commands.push(name);
                        client.categories.set('no category', commands);
                    }

                    log("SUCCESS", "src/registry.js", "Loaded command "+name)
                } catch (e) {
                    log("ERROR", "src/registry.js", "Error loading commands: "+e.message);
                }
            }
        }
    }
}

async function registerEvents(client, ...dirs) {
    for (const dir of dirs) {
        let files = await fs.readdir(path.join(__dirname, dir));
        // Loop through each file.
        for(let file of files) {
            let stat = await fs.lstat(path.join(__dirname, dir, file));
            if(stat.isDirectory()) // If file is a directory, recursive call recurDir
                await registerEvents(client, path.join(dir, file));
            else {
                if(!file.endsWith(".js")) continue;
                let eventModule = require(path.join(__dirname, dir, file));
                if (eventModule.once) 
                    client.once(eventModule.name, (...args) => eventModule.execute(client, ...args));
                else 
                    client.on(eventModule.name, (...args) => eventModule.execute(client, ...args));
            }
        }
    }
}

async function registerAlternateEvents(eventClient, otherClient, ...dirs) {
    for (const dir of dirs) {
        let files = await fs.readdir(path.join(__dirname, dir));
        // Loop through each file.
        for(let file of files) {
            let stat = await fs.lstat(path.join(__dirname, dir, file));
            if(stat.isDirectory()) // If file is a directory, recursive call recurDir
                await registerEvents(eventClient, otherClient, path.join(dir, file));
            else {
                if(!file.endsWith(".js")) continue;
                let eventModule = require(path.join(__dirname, dir, file));
                if (eventModule.once) 
                    eventClient.once(eventModule.name, (...args) => eventModule.execute(otherClient, ...args));
                else 
                eventClient.on(eventModule.name, (...args) => eventModule.execute(otherClient, ...args));
            }
        }
    }
}

async function deployCommands(client) {
    const rest = new REST().setToken(client.token);

    try {
        var builtCommands = [];

        client.commands.forEach(command => {
            var slashCommand = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);

            if(command.options) {
                command.options.forEach(commandOption => {
                    switch(commandOption.type) {
                        case "string":
                            slashCommand.addStringOption((option) =>
                            option.setName(commandOption.name)
                            .setDescription(commandOption.description)
                            .setRequired(commandOption.required ? commandOption.required : false))
                            break;
                    }
                });
            }
            
            builtCommands.push(slashCommand.toJSON());
        });

		const data = await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: builtCommands },
		);

        log("SUCCESS", "src/registry.js", "Deployed all commands!");
		// console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}

module.exports = {
    registerEvents, registerCommands, deployCommands, registerAlternateEvents
}
const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('fs');
const path = require('path');
const { ConLog } = require('@codump/conlog')

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    const guildsDir = path.resolve(__dirname, 'guilds');
    const globalDir = path.resolve(__dirname, 'global', 'commands');

    // collect global commands
    let globalCommands = [];
    let globalCommandNames = new Set();

    if (fs.existsSync(globalDir)) {
        const globalFiles = fs.readdirSync(globalDir).filter(f => f.endsWith('.js'));
        for (const file of globalFiles) {
            const command = require(path.join(globalDir, file));
            globalCommands.push(command.data.toJSON());
            globalCommandNames.add(command.data.name); 
        }
    }

    // register global commands
    try {
        ConLog(`Deploying ${globalCommands.length} Global Commands...`, 'ok');
        await rest.put(Routes.applicationCommands(clientId), { body: globalCommands });
    } catch (err) {
        ConLog(err)
    }

    // register guild commands
    if (fs.existsSync(guildsDir)) {
        const guildFolders = fs.readdirSync(guildsDir).filter(folder => folder !== 'guilds-folder-template');
        for (const guildId of guildFolders) {
            const guildCmdDir = path.join(guildsDir, guildId, 'commands');
            if (!fs.existsSync(guildCmdDir)) continue;

            // filter on commands that are not in globalCommandNames
            const guildCommands = fs.readdirSync(guildCmdDir)
                .filter(f => f.endsWith('.js'))
                .map(file => require(path.join(guildCmdDir, file)))
                .filter(cmd => !globalCommandNames.has(cmd.data.name)) 
                .map(cmd => cmd.data.toJSON());

            try {
                ConLog(`Guild ${guildId} has ${guildCommands.length} unique commands that are not in the global commands list. Deploying those to the guild...`, 'ok');
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: guildCommands });
            } catch (err) {
                ConLog(err)
            }
        }
    }
    ConLog("Registration complete.", 'ok');
})();
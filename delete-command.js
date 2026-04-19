const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const { ConLog } = require('@codump/conlog')

const rest = new REST({ version: '10' }).setToken(token);

// CHANGE commandId -> To delete a specific command, you will need its id. Head to Server Settings -> Integrations -> Bots and Apps and choose your bot. Then, right click a command and click Copy ID.

// for guild-based commands - guildId - commandId
	//rest.delete(Routes.applicationGuildCommand(clientId,
	//	'guilId', 'commandId'))
	//	.then(() => ConLog('Successfully deleted guild command', 'ok'))
	//	.catch(console.error);

// for global commands
	rest.delete(Routes.applicationCommand(clientId, 'commandId'))
		.then(() => ConLog('Successfully deleted application command', 'ok'))
		.catch(console.error);
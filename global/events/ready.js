const { Events, ActivityType } = require('discord.js')
const conlog = require('@codump/conlog')
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
	return conlog.ConLog(text, type)
}
const { status } = require('../../config.json') 

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		
		// set status
		ConLog(`Ready! Logged in as ${client.user.tag} GLOBAL`, 'ok')
		if(status === 'dev') {
			client.user.setPresence({
    		activities: [{
      	  name: '[in dev] codump.github.io',
      	  type: ActivityType.Watching,
      	  url: 'https://codump.github.io', 
      	  state: 'In development, keep the bug spray ready.'
    		}],
    		status: 'dnd',
			})
		} else {
			client.user.setPresence({
    		activities: [{
        	name: 'codump.github.io',
        	type: ActivityType.Watching,
        	url: 'https://codump.github.io', 
    		}],
    		status: 'online',
			})
		}
		// set status
		
	},
}

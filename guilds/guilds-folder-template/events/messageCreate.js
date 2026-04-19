const { Events } = require('discord.js')
const {  } = require('../../../config.json')
const conlog = require('@codump/conlog')
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
	return conlog.ConLog(text, type)
}

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        const serverName = message.guild.name.toLowerCase()
        const messageContent = message.content.toLowerCase()

        if (messageContent.includes(serverName)) {
            try {
                await message.react('👍')
            } catch (error) {
                ConLog(error)
            }
        }
	},
}

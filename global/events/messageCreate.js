const { Events } = require('discord.js')
const {  } = require('../../config.json')
const conlog = require('@codump/conlog')
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
  return conlog.ConLog(text, type) 
}

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
    
    // auto react
		if (message.content.toLowerCase().includes('codump')) {
      try {
        await message.react('♻️')
        await message.react('🍻')
      } catch (error) {
				ConLog(error)
      }
    }
    // auto react
    
	},
}

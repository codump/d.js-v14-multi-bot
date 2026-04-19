const { Events } = require('discord.js')
const conlog = require('@codump/conlog')
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
  return conlog.ConLog(text, type)
}
const { rolesChannel, role1Id, role2Id } = require('../guild-config.json')

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, user) {
		if (reaction.message.channelId == rolesChannel) {
			if(reaction._emoji.name == '🚀') {
				const member = await reaction.message.guild.members.fetch(user.id)
				member.roles.add(role1Id)
        ConLog(`Added role ${role1Id} to ${user.globalName}.`, `ok`)
			}
			if (reaction._emoji.name == '🎗') {
				const member = await reaction.message.guild.members.fetch(user.id)
				member.roles.add(role2Id)
        ConLog(`Added role ${role2Id} to ${user.globalName}.`, `ok`)
			}
		}
	},
}
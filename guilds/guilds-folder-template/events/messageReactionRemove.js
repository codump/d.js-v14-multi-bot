const { Events } = require('discord.js')
const conlog = require('@codump/conlog')
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
  return conlog.ConLog(text, type)
}
const { rolesChannel, role1Id, role2Id } = require('../guild-config.json')

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(reaction, user) {
		if (reaction.message.channelId == rolesChannel) {
			if (reaction._emoji.name == '🚀') {
				const member = await reaction.message.guild.members.fetch(user.id)
				member.roles.remove(role1Id)
        ConLog(`Removed role ${role1Id} from ${user.globalName}.`, `ok`)
			}
			if (reaction._emoji.name == '🎗') {
				const member = await reaction.message.guild.members.fetch(user.id)
				member.roles.remove(role2Id);
        ConLog(`Removed role ${role2Id} from ${user.globalName}.`, `ok`)
			}
		}
	},
}
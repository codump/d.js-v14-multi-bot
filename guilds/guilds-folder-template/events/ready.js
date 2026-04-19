const { Events } = require('discord.js')
const conlog = require('@codump/conlog')
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
  return conlog.ConLog(text, type)
}

const { botStartNotificationForGuilds } = require('../../../config.json')
const { perGuildId, startNotification, startNotificationChannel } = require('../guild-config.json')

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const guildId = perGuildId
    const channelId = startNotificationChannel

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return ConLog(`Guild ${guildId} not found in cache.`, 'error')

    try {
        const botMember = await guild.members.fetchMe();
				
        ConLog(`Ready! ${guild.name}(${guildId}) bot logged in as ${botMember.displayName}`, 'ok')

        if(botStartNotificationForGuilds == true && startNotification == true) {
          const channel = guild.channels.cache.get(channelId);
          if (channel) {
            channel.send(`🛡️ **${guild.name}** bot is now online!`)
          } else {
            ConLog(`Could not find channel ${channelId} in guild ${guild.name}`, 'error')
          }
        }
    } catch (err) {
        ConLog(`Failed to fetch bot member in ${guild.name}: ${err}`, 'error')
    }
  },
}
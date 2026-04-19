const { Client, GatewayIntentBits, MessageFlags, Partials } = require('discord.js')
const fs = require('fs')
const path = require('path')
const conlog = require('@codump/conlog')
const { ConLogInit, ConLogSet, ConLogWebhook, ConLogStartMsg } = conlog
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
    return conlog.ConLog(text, type)
}
const { token, systemLog, systemLogWebhook, conLogStartMsg, conLogError, conLogOK, conLogWarning, conLogObject, conLogColor } = require('./config.json')

ConLogSet({error: conLogError, ok: conLogOK, warning: conLogWarning, object: conLogObject, color: conLogColor})
ConLogWebhook(systemLog, `discord`, systemLogWebhook)
ConLogStartMsg(conLogStartMsg)

// logger
process.on('warning', (warning) => {
    ConLog(`[WARNING] ${warning.name}: ${warning.message}`, 'warning')
    ConLog(warning.stack, 'warning')
})
process.on('error', (error) => {
    ConLog(`[ERROR] ${error.name}: ${error.message}`, 'error')
    ConLog(error.stack, 'error')
})

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.User],
})

// find the correct file path (guild first, then global)
function getResourcePath(guildId, type, fileName) {
    const guildPath = path.resolve(__dirname, 'guilds', guildId, type, fileName)
    const globalPath = path.resolve(__dirname, 'global', type, fileName)

    if (fs.existsSync(guildPath)) return guildPath
    if (fs.existsSync(globalPath)) return globalPath
    return null
}

// command interaction handler
client.on('interactionCreate', async (interaction) => {
    // commands
    if (interaction.isChatInputCommand()) {
        const commandPath = getResourcePath(interaction.guildId, 'commands', `${interaction.commandName}.js`)
        if (!commandPath) return interaction.reply({ content: 'Command not found.', flags: [MessageFlags.Ephemeral] })

        try {
            delete require.cache[require.resolve(commandPath)]
            const command = require(commandPath)
            if (command.execute) await command.execute(interaction)
        } catch (error) {
            ConLog(`[ERROR] ${error.name}: ${error.message}`, 'error')
            ConLog(error.stack, 'error')
            const errPayload = { content: 'Error executing command!', flags: [MessageFlags.Ephemeral] }
            interaction.replied || interaction.deferred ? await interaction.followUp(errPayload) : await interaction.reply(errPayload)
        }
        return
    }

    // buttons, modals, etc.
    const handleInteraction = async (dirPath) => {
        const eventPath = path.join(dirPath, 'events', 'interactionCreate.js')
        if (fs.existsSync(eventPath)) {
            try {
                delete require.cache[require.resolve(eventPath)]
                const eventFile = require(eventPath)
                if (eventFile.execute) await eventFile.execute(interaction)
            } catch (err) {
                ConLog(err)
            }
        }
    }

    // first global then guild-specific, so guild can override global if needed
    await handleInteraction(path.resolve(__dirname, 'global'))
    await handleInteraction(path.resolve(__dirname, 'guilds', interaction.guildId))
})

/* messageCreate event handler
Keep in mind that this is an intentsive event, so be careful with what you put in the event handler and try to avoid doing heavy tasks in it. Also, keep in mind that the event handler will be executed for every message sent in the guilds the bot is in, so make sure to add checks to avoid unnecessary executions.
*/
client.on('messageCreate', async (message) => {
    if (message.author.bot && !message.webhookId || !message.guild) return

    const globalEventPath = path.resolve(__dirname, 'global', 'events', 'messageCreate.js')
    
    if (fs.existsSync(globalEventPath)) {
        try {
            delete require.cache[require.resolve(globalEventPath)]
            const globalEvent = require(globalEventPath)
            if (globalEvent.execute) {
                globalEvent.execute(message)
            } else if (typeof globalEvent === 'function') {
                globalEvent(message)
            }
        } catch (err) {
            ConLog(err)
        }
    }

    const guildEventPath = path.resolve(__dirname, 'guilds', message.guild.id, 'events', 'messageCreate.js')

    if (fs.existsSync(guildEventPath)) {
        try {
            delete require.cache[require.resolve(guildEventPath)]
            const guildEvent = require(guildEventPath)
            if (guildEvent.execute) {
                guildEvent.execute(message)
            } else if (typeof guildEvent === 'function') {
                guildEvent(message)
            }
        } catch (err) {
            ConLog(err)
        }
    }
})

// messageReactionAdd event
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot || !reaction.message.guild) return

    if (reaction.partial) {
        try {
            await reaction.fetch()
        } catch (error) {
            ConLog(`[ERROR] ${error.name}: ${error.message}`, 'error')
            ConLog(error.stack, 'error')
            return ConLog(error)
        }
    }

    const guildId = reaction.message.guild.id
    const eventName = 'messageReactionAdd'

    const executeEvent = (dirPath) => {
        const filePath = path.resolve(__dirname, dirPath, 'events', `${eventName}.js`)
        if (fs.existsSync(filePath)) {
            try {
                delete require.cache[require.resolve(filePath)]
                const event = require(filePath)
                if (event.execute) event.execute(reaction, user)
                else if (typeof event === 'function') event(reaction, user)
            } catch (err) {
                ConLog(err)
            }
        }
    }

    executeEvent('global')
    executeEvent(`guilds/${guildId}`)
})

// messageReactionRemove event
client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot || !reaction.message.guild) return

    if (reaction.partial) {
        try {
            await reaction.fetch()
        } catch (error) {
            ConLog(`[ERROR] ${error.name}: ${error.message}`, 'error')
            ConLog(error.stack, 'error')
            return ConLog(error)
        }
    }

    const guildId = reaction.message.guild.id
    const eventName = 'messageReactionRemove'

    const executeEvent = (dirPath) => {
        const filePath = path.resolve(__dirname, dirPath, 'events', `${eventName}.js`)
        if (fs.existsSync(filePath)) {
            try {
                delete require.cache[require.resolve(filePath)]
                const event = require(filePath)
                if (event.execute) event.execute(reaction, user)
                else if (typeof event === 'function') event(reaction, user)
            } catch (err) {
                ConLog(err)
            }
        }
    }

    executeEvent('global')
    executeEvent(`guilds/${guildId}`)
})

// client ready event handler
client.once('clientReady', async () => {
    ConLog(`✅ Master Bot Online: Logged in as ${client.user.tag}`, 'ok')

    // Global ready event
    const globalReadyPath = path.resolve(__dirname, 'global', 'events', 'ready.js')
    if (fs.existsSync(globalReadyPath)) {
        try {
            delete require.cache[require.resolve(globalReadyPath)]
            const globalReady = require(globalReadyPath)
            if (globalReady.execute) {
                globalReady.execute(client)
            } else if (typeof globalReady === 'function') {
                globalReady(client)
            }
        } catch (err) {
            ConLog(err)
        }
    }

    // Guild ready events
    client.guilds.cache.forEach(guild => {
        const guildReadyPath = path.resolve(__dirname, 'guilds', guild.id, 'events', 'ready.js')

        if (fs.existsSync(guildReadyPath)) {
            try {
                delete require.cache[require.resolve(guildReadyPath)]
                const guildReady = require(guildReadyPath)
                if (guildReady.execute) {
                    guildReady.execute(client)
                } else if (typeof guildReady === 'function') {
                    guildReady(client)
                }
            } catch (err) {
                ConLog(`[Guild Ready Error] ${guild.id}: ${err}`, 'error')
            }
        }
    })
})

client.login(token)
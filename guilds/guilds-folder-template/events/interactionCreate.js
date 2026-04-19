const { Client, Events, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, MessageFlags, TextInputStyle, LabelBuilder, TextDisplayBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits, GatewayIntentBits } = require('discord.js')
const conlog = require('@codump/conlog')
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
	return conlog.ConLog(text, type)
}
const { perGuildId, ticketCategoryId, rolesChannel, role1Id, role2Id } = require('../guild-config.json')

module.exports = {
  async execute(interaction) { 
    if (interaction.isButton()) { 
      const btn_id = interaction.customId

      // open ticket-setup modal
			if (btn_id === `ticket-setup-${perGuildId}`) {
			  const modal = new ModalBuilder()
			    .setCustomId(`ticket-setup-modal-${perGuildId}`)
			    .setTitle('Setup your ticket system!')
			
  			const channelSelect = new ChannelSelectMenuBuilder()
  			  .setCustomId(`ticket-channel-${perGuildId}`)
  			  .setPlaceholder('Select a channel to create the ticket button in.')
    			.setChannelTypes(ChannelType.GuildText)
  			const subjectInput = new LabelBuilder()
  			  .setLabel('Ticket channel:')
  			  .setChannelSelectMenuComponent(channelSelect)

				const btnTxtInput = new LabelBuilder()
					.setLabel('Button text:')
					.setTextInputComponent(new TextInputBuilder({
						customId: `create-ticket-btn-txt-${perGuildId}`,
						placeholder: 'Example: Open new ticket',
						style: TextInputStyle.Short,
						required: true
					}))
				const btnEmojiInput = new LabelBuilder()
					.setLabel('Button emoji:')
					.setTextInputComponent(new TextInputBuilder({
						customId: `create-ticket-btn-emoji-${perGuildId}`,
						placeholder: '📩',
						style: TextInputStyle.Short,
						required: false
					}))

				const ticketTextInput = new LabelBuilder()
					.setLabel('Message:')
					.setTextInputComponent(new TextInputBuilder({
						customId: `create-ticket-message-${perGuildId}`,
						placeholder: 'Example: Click on the button below to open a new ticket.',
						style: TextInputStyle.Paragraph,
						required: true
					}))

  			const text = new TextDisplayBuilder().setContent(
    			"-# **Select a channel and submit to place the ticket button.**"
  			)

  			modal.addLabelComponents(subjectInput, btnTxtInput, btnEmojiInput, ticketTextInput)
    			.addTextDisplayComponents(text)

 			 return await interaction.showModal(modal)
			}
			// open ticket-setup modal

			// ticket button
			if (btn_id === `create-ticket-${perGuildId}`) {
				const modal = new ModalBuilder()
    			.setCustomId(`the-ticket-modal-${perGuildId}`)
    			.setTitle('Start a ticket')

				const subjectInput = new LabelBuilder()
  			  .setLabel("Subject:")
  			  .setTextInputComponent(new TextInputBuilder({
  			    customId: `ticket-subject-${perGuildId}`,
  			    style: TextInputStyle.Short,
  			    required: true
  			  }))

				const ticketTextInput = new LabelBuilder()
  			  .setLabel("Your message:")
  			  .setTextInputComponent(new TextInputBuilder({
  			    customId: `ticket-text-${perGuildId}`,
  			    maxLength: 1000,
  			    style: TextInputStyle.Paragraph,
  			    required: true
  			  }))

				const text = new TextDisplayBuilder().setContent(
    			"-# **Note:** Please ensure your ticket submission follows our rules."
  			)

				modal.addLabelComponents(subjectInput, ticketTextInput)
					.addTextDisplayComponents(text)

				return await interaction.showModal(modal)
			}
			// ticket button

			// roles button
			if (btn_id === `insert-roles-${perGuildId}`) {
				try {
					const channel = await interaction.client.guilds.cache.get(perGuildId).channels.cache.get(rolesChannel)

					if (!channel || channel.type !== 'text') {
						const roleMessage = await channel.send({ content: `**React with the respective emoji under this message to choose a role and the functions that come with it.**\n\n:rocket: <@&${role1Id}> role 1 description here.\n\n:reminder_ribbon: <@&${role2Id}> role 2 description here.\n\n👇` })
						roleMessage.react('🚀')
						roleMessage.react('🎗')

						ConLog('Role selection inserted.', 2)
						const replyOptions = { 
							content: `Role selection inserted.`, 
							flags: [MessageFlags.Ephemeral] 
						}
						return interaction.reply(replyOptions)
					}
				} catch (error) {
					let errMsg = error
					if(rolesChannel == "" || role1Id  == "" || role2Id == "") {
						errMsg = `\`guild-config.json\` is not set correctly. ` + error
					}
					ConLog(`${errMsg}`, 1)
					const replyOptions = { 
						content: `${errMsg}`, 
						flags: [MessageFlags.Ephemeral] 
					}
					errMsg = null
					return interaction.reply(replyOptions)
				}
			}
			// roles button
    }
		// buttons

		// modals
    if (interaction.isModalSubmit()) {
			// submit ticket-setup modal
      if (interaction.customId === 		`ticket-setup-modal-${perGuildId}`) {
				try {
					const selectedChannelInfo = interaction.fields.getField(`ticket-channel-${perGuildId}`)
					const selectedChannelId = selectedChannelInfo.values[0]
					const targetChannel = interaction.guild.channels.cache.get(selectedChannelId)

					const ticketButtonText = interaction.fields.getTextInputValue(`create-ticket-btn-txt-${perGuildId}`)
					const ticketButtonEmoji = interaction.fields.getTextInputValue(`create-ticket-btn-emoji-${perGuildId}`)
					const ticketMessage = interaction.fields.getTextInputValue(`create-ticket-message-${perGuildId}`)

					function isValidEmoji(input) {
   					const customEmojiRegex = /^<a?:\w+:\d+>$/
   					const unicodeEmojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})$/u
    				return customEmojiRegex.test(input) || unicodeEmojiRegex.test(input)
					}
					if (ticketButtonEmoji && !isValidEmoji(ticketButtonEmoji)) {
    				return await interaction.reply({ 
    				    content: '❌ Invalid emoji!', 
        				flags: [MessageFlags.Ephemeral]
    				})
					}
					
					if (targetChannel) {
						let ticketButton
						if(ticketButtonEmoji) {
							ticketButton = new ActionRowBuilder()
    				  .addComponents(
    				    new ButtonBuilder()
    				      .setCustomId(`create-ticket-${perGuildId}`)
    				      .setLabel(ticketButtonText)
    				      .setEmoji(ticketButtonEmoji)
    				      .setStyle(ButtonStyle.Primary),
    				  )
						} else {
							ticketButton = new ActionRowBuilder()
						  .addComponents(
						    new ButtonBuilder()
						      .setCustomId(`create-ticket-${perGuildId}`)
						      .setLabel(ticketButtonText)
						      .setStyle(ButtonStyle.Primary),
						  )
						}

    				await targetChannel.send({
    				  content: ticketMessage,
    				  components: [ticketButton]
    				})
						ticketButton = null

    				await interaction.reply({ content: `Ticket system has been set up in ${targetChannel}!`, flags: [MessageFlags.Ephemeral] })
					} else {
				    await interaction.reply({ content: 'Cannot reach the selected channel. It doesn\'t exist or permission has been denied.', flags: [MessageFlags.Ephemeral] })
					}
				} catch (err) {
					ConLog(err)
					interaction.reply({ content: 'Error please try again later.', flags: [MessageFlags.Ephemeral]  })
				}
			}
			// submit ticket-setup modal

			// submit ticket modal
			if (interaction.customId === `the-ticket-modal-${perGuildId}`) {
    		const ticketSubject = interaction.fields.getTextInputValue(`ticket-subject-${perGuildId}`)
    		const ticketText = interaction.fields.getTextInputValue(`ticket-text-${perGuildId}`)

    		try {
        	const guild = await interaction.client.guilds.fetch(interaction.guildId)
        
        	const ticketChannel = await guild.channels.create({
        	  name: `ticket-${interaction.user.username}`,
        	  parent: ticketCategoryId, 
        	  type: 0, 
        	  topic: `Subject: ${ticketSubject}`,
        	  permissionOverwrites: [
        			{
        			  id: guild.id, // hide for @everyone
        			  deny: ['ViewChannel'],
        			},
        			{
        			  id: interaction.user.id, // allow ticket creator
        			  allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
        			},
        			{
        				id: guild.members.me.roles.highest.id, // set bot's own highest role
          			allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels'],
      				},
    				],
      		})

        	await ticketChannel.send({
        	  content: `New ticket from ${interaction.user}!\n**Subject:** ${ticketSubject}\n**Description:** ${ticketText}`
        	})

        	await interaction.reply({ 
        	  content: `Ticket created! Check it out here: ${ticketChannel}`, 
        	  flags: [MessageFlags.Ephemeral] 
        	})

    		} catch (err) {
    		  ConLog(err)
    		  interaction.reply({ content: 'Error please try again later.', flags: [MessageFlags.Ephemeral] })
    		}
			}
			// submit ticket modal
    }
		// modals
  },
}
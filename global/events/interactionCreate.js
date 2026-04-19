const { MessageFlags, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, TextDisplayBuilder } = require('discord.js')
const conlog = require('@codump/conlog')
/** @type {typeof conlog.ConLog} */
function ConLog(text, type) { 
	return conlog.ConLog(text, type) 
}
const { masterGuild, feedbackChannelId } = require('../../config.json')

module.exports = {
  async execute(interaction) { 
    // buttons
    if (interaction.isButton()) { 
      const btn_id = interaction.customId

      // open feedback modal
      if (btn_id === 'send-feeback') {
        const modal = new ModalBuilder()
          .setCustomId('send-feeback-modal')
          .setTitle('Send us your feedback!')

        const subjectInput = new LabelBuilder()
					.setLabel('Title:')
					.setTextInputComponent(new TextInputBuilder({
						customId: 'feedback-title',
						placeholder: 'Example, the guide says to do X but there is no option for X.',
						style: TextInputStyle.Short,
						required: true
					}))

         const ticketTextInput = new LabelBuilder()
					.setLabel('Message:')
					.setTextInputComponent(new TextInputBuilder({
						customId: 'feedback-message',
						placeholder: 'I\'d love to hear the reasoning behind your feedback in as much detail as possible.',
						style: TextInputStyle.Paragraph,
						required: true
					}))
				const text = new TextDisplayBuilder().setContent(
					"-# **Keep in mind that this is for feedback only. If you want us to reply please use the contact developer button.**"
					)

				modal.addLabelComponents(subjectInput, ticketTextInput)
					.addTextDisplayComponents(text)

				return await interaction.showModal(modal)
    	}
			// open feedback modal
    }
		// buttons

    // modals
    if (interaction.isModalSubmit()) {
			// submit feedback modal
      if (interaction.customId === 'send-feeback-modal') {
        const ticketSubject = interaction.fields.getTextInputValue('feedback-title')
        const ticketText = interaction.fields.getTextInputValue('feedback-message')

				try {
        	const guild = await interaction.client.guilds.fetch(masterGuild)
        	const channel = await guild.channels.fetch(feedbackChannelId)

          const feedbackEmbed = new EmbedBuilder()
          	.setTitle('New Feedback Received')
          	.setColor(0x268df6)
          	.addFields(
        		  { name: '**Title**', value: ticketSubject },
        		  { name: '**Message**', value: ticketText },
        		  { name: '**Submitted by**', value: `${interaction.user.tag} (${interaction.user.id})\n${interaction.guild.name} (${interaction.guildId})` }
            )
            .setTimestamp()

          await channel.send({ embeds: [feedbackEmbed] })
              
					await interaction.reply({ content: `Feedback submitted:\n**${ticketSubject}**\n${ticketText}`, flags: [MessageFlags.Ephemeral]  })
				} catch (err) {
					ConLog(err)
					interaction.reply({ content: 'Error please try again later.', flags: [MessageFlags.Ephemeral]  })
				}
			}
			// submit feedback modal
    }
		// modals
  },
}
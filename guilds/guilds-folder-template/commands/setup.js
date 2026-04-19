const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { adminContactUrl } = require('../../../config.json');
const { perGuildId } = require('../guild-config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Test the status of your bot.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Restricts to Admins
	async execute(interaction) {

		/*
			We are creating a unique ticket system for this guild.
		  You can change this setup command to create your unique setup logic and features for this guild. You can also remove this ticket system from this file if you dont't want to use it. The only thing you need to do is make sure to remove the ticket system button and modal from the /guilds/guildID/events/interactionCreate event as well.
		*/
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x00b646)
			.addFields(
				{ name: 'Status', value: 'There is a **unique guild bot** installed!\n\nYou can find buttons below to configure your custom bot.' },
			);
		
		const row = new ActionRowBuilder();
		row.addComponents(
			new ButtonBuilder()
				.setLabel('Contact Developer')
				.setStyle(ButtonStyle.Link)
				.setURL(adminContactUrl)
		);
		row.addComponents(
			new ButtonBuilder()
				.setCustomId(`ticket-setup-${perGuildId}`) 
				.setLabel('Ticket system')
				.setStyle(ButtonStyle.Primary)
				.setEmoji('📨')
		);

		const replyOptions = { 
			content: `Hi there ${interaction.user}! Here you have a list of functions and how to use them.`, 
			embeds: [exampleEmbed], 
			flags: [MessageFlags.Ephemeral] 
		};

		if (row.components.length > 0) {
			replyOptions.components = [row];
		}

		return interaction.reply(replyOptions); 
		/* We are creating a unique ticket system for this guild. */
	},
};
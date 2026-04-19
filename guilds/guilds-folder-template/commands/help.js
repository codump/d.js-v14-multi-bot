const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { adminContactUrl } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show help information for your bot.'),
	async execute(interaction) {
		const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);

		const exampleEmbed = new EmbedBuilder()
			.setColor(0x00b646);

		if (isAdmin) {
			exampleEmbed.addFields(
				{ name: 'Admin Help', value: 'Use `/setup` to check the bot\'s status.' },
			);
		} else {
			exampleEmbed.addFields(
				{ name: 'User Help', value: 'Here you give the normal user a guide on how to use the bot and its commands.' },
			);
		}
		const row = new ActionRowBuilder();
		row.addComponents(
			new ButtonBuilder()
				.setLabel('Contact Developer')
				.setStyle(ButtonStyle.Link)
				.setURL(adminContactUrl)
		);
		row.addComponents(
			new ButtonBuilder()
				.setCustomId('send-feeback') 
				.setLabel('Send us your feedback!')
				.setStyle(ButtonStyle.Success)
				.setEmoji('❤️')
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
	},
};
const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Test the status of your bot.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Restricts to Admins
	async execute(interaction) {
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x00b646)
			.addFields(
				{ name: 'Status', value: 'There is a global bot installed.' },
			);

		return interaction.reply({ 
      content: `Hi there ${interaction.user}!`, 
      embeds: [exampleEmbed], 
      flags: [MessageFlags.Ephemeral] 
    }); 
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Calculate API Latency and Websocket heartbeat.'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });

		interaction.editReply({ content: `Websocket heartbeat: ${interaction.client.ws.ping}ms\nRoundtrip API latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`, ephemeral: true });
	},
};

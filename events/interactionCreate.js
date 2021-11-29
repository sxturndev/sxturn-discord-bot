const logger = require('../logger.js');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		logger.info(`${interaction.user.tag} in #${interaction.channel.name} used: /${interaction.commandName}`);
	},
};
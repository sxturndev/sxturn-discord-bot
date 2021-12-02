const logger = require('../logger.js');
const setPresence = require('../functions/setPresence.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		logger.info(`Logged in as ${client.user.tag}.`);
		setPresence(client);
	},
};
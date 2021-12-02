const logger = require('../logger.js');
const db = require('quick.db');

module.exports = (client, embed) => {
	const logChannel = client.channels.cache.get(db.get('log_channel'));
	logger.info(`Sending log in ${logChannel.name}`);
	logChannel.send({ embeds: [embed] });
};
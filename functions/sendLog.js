const logger = require('../logger.js');
const client = require('../index.js');
const db = require('quick.db');

module.exports = (embed) => {
	logger.info('Sending a log.');
	const logChannel = client.channels.cache.get(db.get('log_channel'));
	logChannel.send({ embeds: [embed] });
};
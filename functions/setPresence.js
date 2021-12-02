require('dotenv').config();
const logger = require('../logger.js');
const guildId = process.env.GUILD_ID;

module.exports = (client) => {
	const guild = client.guilds.cache.get(guildId);
	const userCount = guild.memberCount;
	logger.info(`${userCount} users are in the guild. Setting presence.`);

	client.user.setPresence({
		status: 'online',
		activities: [{
			name: `${userCount} users`,
			type: 'WATCHING',
		}],
	});
};
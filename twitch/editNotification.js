const { MessageEmbed } = require('discord.js');
const logger = require('../logger.js');
const db = require('quick.db');

module.exports = (user, client) => {
	if (!db.has(user.name)) {
		logger.warn('WARNING: No cached stream found, not editing embed.');
		return;
	}
	const message = db.get(`${user.name}.messageId`);

	const now = Date.now();
	const startDate = db.get(`${user.name}.startDate`);
	const duration = (date1, date2) => {
		const diffInMs = Math.abs(date2 - date1);
		return Math.round(diffInMs / (1000 * 60));
	};

	const pingRole = db.get('ping_role');
	const channel = client.channels.cache.get(db.get('alert_channel'));
	const twitchURL = `https://www.twitch.tv/${user.name}/`;
	const edited = new MessageEmbed()
		.setTitle(`${user.name} (OFFLINE)`)
		.setDescription(`${twitchURL}\nStreamed ${db.get(`${user.name}.streamTitle`)} in ${db.get(`${user.name}.streamGame`)} for ${duration(now, startDate)} minutes.`)
		.setColor('#db0404')
		.setThumbnail(user.profilePictureUrl)
		.setTimestamp();

	channel.messages.fetch(message)
		.then(m => m.edit({ content: `<@&${pingRole}>`, embeds: [edited] }))
		.catch(err => logger.error(err));
	db.delete(user.name);
};
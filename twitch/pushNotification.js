const { MessageEmbed } = require('discord.js');
const logger = require('../logger.js');
const db = require('quick.db');

module.exports = async (user, client) => {
	const channel = client.channels.cache.get(db.get('alert_channel'));
	const pingRole = db.get('ping_role');
	const stream = await user.getStream();

	const notification = new MessageEmbed()
		.setTitle(`${stream.userName} - ${stream.gameName}`)
		.setDescription(`https://www.twitch.tv/${stream.userName}/\n${stream.title}`)
		.setColor('#3bdd00')
		.setThumbnail(user.profilePictureUrl)
		.setImage(stream.getThumbnailUrl(1280, 720))
		.setTimestamp();

	channel.send({ content: (`Hey <@&${pingRole}>, ${stream.userName} just went live on Twitch!`), embeds: [notification] })
		.then(sent => {
			db.delete(user.name);
			db.set(user.name, { messageId: sent.id, startDate: stream.startDate.getTime(), streamTitle: stream.title, streamGame: stream.gameName });
			logger.info(db.get(user.name));
			logger.info('LOGGING: Cached twitch live stream in database.');
		})
		.catch(err => logger.error(err));
};


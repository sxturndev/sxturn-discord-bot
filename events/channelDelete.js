const { MessageEmbed } = require('discord.js');
const dayjs = require('dayjs');
const sendLog = require('../functions/sendLog.js');
const logger = require('../logger.js');

module.exports = {
	name: 'channelDelete',
	execute(channel, client) {
		const embed = new MessageEmbed()
			.setTitle('**A channel was deleted.**')
			.setColor('RED')
			.addFields(
				{ name: '**Name**', value: channel.name, inline: true },
				{ name: '**ID**', value: channel.id, inline: true },
				{ name: '**Type**', value: channel.type, inline: true },
				{ name: '**Time of Deletion**', value: dayjs().format('MMMM D, YYYY h:mm A') },
			)
			.setTimestamp();
		logger.info(`${channel.client}`);
		logger.info(`LOGGING: Channel ${channel.name} was deleted.`);
		sendLog(client, embed);
	},
};

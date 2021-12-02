const { MessageEmbed } = require('discord.js');
const dayjs = require('dayjs');
const sendLog = require('../functions/sendLog.js');
const logger = require('../logger.js');

module.exports = {
	name: 'channelCreate',
	execute(channel, client) {
		const embed = new MessageEmbed()
			.setTitle('**A new channel was created.**')
			.setColor('GREEN')
			.addFields(
				{ name: '**Name**', value: channel.name, inline: true },
				{ name: '**ID**', value: channel.id, inline: true },
				{ name: '**Type**', value: channel.type, inline: true },
				{ name: '**Time of Creation**', value: dayjs(channel.createdAt).format('MMMM D, YYYY h:mm A') },
			)
			.setTimestamp();
		logger.info(`LOGGING: Channel ${channel.name} was created.`);
		sendLog(client, embed);
	},
};

const { MessageEmbed } = require('discord.js');
const sendLog = require('../functions/sendLog.js');
const logger = require('../logger.js');

module.exports = {
	name: 'channelUpdate',
	execute(oldChannel, newChannel, client) {
		const embed = new MessageEmbed()
			.setTitle(`**Channel ${oldChannel} was edited.**`)
			.setDescription(`${oldChannel.name}`)
			.setColor('YELLOW')
			.setTimestamp();

		if (oldChannel.name !== newChannel.name) {
			embed.addField('**Channel name updated.**', `Before: ${oldChannel.name}\nAfter: ${newChannel.name}`);
		}
		if (oldChannel.nsfw !== newChannel.nsfw) {
			embed.addField('**Channel NSFW Status**', `Set to: ${newChannel.nsfw}`);
		}
		if (oldChannel.topic !== newChannel.topic) {
			embed.addField('**Channel topic updated.**', `Before: ${oldChannel.topic}\nAfter: ${newChannel.topic}`);
		}

		logger.info(`LOGGING: Channel ${oldChannel.name} was edited.`);
		sendLog(client, embed);
	},
};

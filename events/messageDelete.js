const { MessageEmbed } = require('discord.js');
const logger = require('../logger.js');
const sendLog = require('../functions/sendLog.js');

module.exports = {
	name: 'messageDelete',
	execute(message, client) {
		if (message.author.bot) return;
		if (!message.guild) return;

		const embed = new MessageEmbed()
			.setColor('RED')
			.setDescription(`[Message](${message.url}) by ${message.author} was deleted in ${message.channel}\n\n**Deleted Message**:\n ${message.content ? message.content : 'None'}`.slice('0', '4096'))
			.setTimestamp();

		if (message.attachments.size >= 1) {
			embed.addField('**Attachments**:', `${message.attachments.map(a => a.url)}`, true);
		}
		logger.info(`LOGGING: Message ${message.id} by ${message.author.tag} was deleted in ${message.channel.name}.`);
		sendLog(client, embed);
	},
};

const { MessageEmbed } = require('discord.js');
const logger = require('../logger.js');
const sendLog = require('../functions/sendLog.js');

module.exports = {
	name: 'messageUpdate',
	execute(oldMessage, newMessage) {
		if (oldMessage.author.bot) return;
		if (oldMessage.content === newMessage.content) return;

		const count = 1950;

		const original = oldMessage.content.slice(0, count) + (oldMessage.content.length > 1950 ? ' ...' : '');
		const edited = newMessage.content.slice(0, count) + (newMessage.content.length > 1950 ? ' ...' : '');

		const embed = new MessageEmbed()
			.setColor('BLACK')
			.setDescription(`[Message](${newMessage.url}) edited in ${newMessage.channel} by ${newMessage.author}.\n**Original**:\n\`${original}\` \n**Edited**:\n\`${edited}\``.slice('0', '4096'))
			.setTimestamp()
			.setFooter(`User: ${newMessage.author.tag} | ID: ${newMessage.author.id}`);

		logger.info(`LOGGING: Message ${oldMessage.id} was edited in ${oldMessage.channel.name} by ${oldMessage.author.tag}.`);
		sendLog(embed);
	},
};

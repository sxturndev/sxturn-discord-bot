const { MessageEmbed } = require('discord.js');
const logger = require('../logger.js');
const sendLog = require('../functions/sendLog.js');

module.exports = {
	name: 'userUpdate',
	execute(oldUser, newUser) {
		const embed = new MessageEmbed()
			.setTitle(`${oldUser.tag}`)
			.setColor('YELLOW')
			.setDescription(`**<@${newUser.id}> updated their profile!**`)
			.setFooter(`ID: ${newUser.id}`)
			.setTimestamp();

		if (oldUser.avatar !== newUser.avatar) {
			logger.info(`LOGGING: ${oldUser.tag} changed their avatar.`);
			embed.setThumbnail(newUser.displayAvatarURL);
			embed.addField('**Avatar**', `[before](${oldUser.displayAvatarURL({ size: 2048, dynamic: true })}) -> [after](${newUser.displayAvatarURL({ size: 2048, dynamic: true })})`);
		}
		if (oldUser.username !== newUser.username) {
			logger.info(`LOGGING: ${oldUser.tag} changed their username to: ${newUser.username}`);
			embed.addField('**Username**', `${oldUser.username} -> ${newUser.username}`);
		}
		if (oldUser.discriminator !== newUser.discriminator) {
			logger.info(`LOGGING: ${oldUser.tag} changed their discriminator to: ${newUser.discriminator}`);
			embed.addField('**Tag**', `${oldUser.tag} -> ${newUser.tag}`);
		}
		sendLog(embed);
	},
};

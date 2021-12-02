const { MessageEmbed } = require('discord.js');
const dayjs = require('dayjs');
const logger = require('../logger.js');
const sendLog = require('../functions/sendLog.js');
const setPresence = require('../functions/setPresence.js');

// Guild member add and remove are meant to be sent in a logging channel.

module.exports = {
	name: 'guildMemberRemove',
	execute(member, client) {
		const user = member.user;
		logger.info(`LOGGING: ${user.tag} has left the server.`);
		setPresence(client);
		const embed = new MessageEmbed()
			.setTitle(`${user.username} just left the server.  We now have ${member.guild.memberCount} members.`)
			.setColor('RED')
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: '**Discord Tag**', value: user.tag, inline: true },
				{ name: '**Discord ID**', value: user.id, inline: true },
				{ name: '**Leave Date**', value: dayjs().format('MMMM D, YYYY h:mm A') },
			)
			.setTimestamp();
		sendLog(client, embed);
	},
};
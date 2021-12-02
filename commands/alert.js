const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const logger = require('../logger.js');
const twitch = require('../twitch/twitch.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('alert')
		.setDescription('Modify twitch alerts.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a user to the streamer list.')
				.addStringOption(option => option.setName('name').setDescription('The username of the twitch streamer to add.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a user from the list.')
				.addStringOption(option => option.setName('name').setDescription('Name of the user you want to remove from the list.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('Displays a list of subscribed twitch streamers.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('channel')
				.setDescription('Changes the channel where notifications are sent.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('help')
				.setDescription('Display details for /alert commands.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('role')
				.setDescription('Change the role that will be pinged when a Twitch notification is pushed.')
				.addRoleOption(option => option.setName('role').setDescription('Role to ping for Twitch notifications.').setRequired(true))),
	async execute(interaction) {
		const hasPerms = interaction.member.permissions.has('SEND_MESSAGES');
		if (!hasPerms) return interaction.reply({ content: 'You do not have permission to do this.', ephemeral: true });
		if (interaction.options.getSubcommand() === 'add') {
			const user = interaction.options.getString('name').toLowerCase();

			if (db.get('twitch_users').includes(user)) return interaction.reply({ content: 'User is already in the list.', ephemeral: true });

			const broadcaster = await twitch.apiClient.users.getUserByName(user);
			if (!broadcaster) return interaction.reply({ content: 'This user doesn\'t exist.', ephemeral: true });
			db.push('twitch_users', user);
			await twitch.newOnlineSub(broadcaster, interaction.client);
			await twitch.newOfflineSub(broadcaster, interaction.client);
			interaction.reply({ content: `Added the user ${user}`, ephemeral: true });
		}

		if (interaction.options.getSubcommand() === 'remove') {
			const user = interaction.options.getString('name').toLowerCase();
			const users = db.get('twitch_users');

			if (!users.includes(user)) {
				logger.info('LOGGING: Could not remove twitch user, not found in database.');
				return interaction.reply({ content: 'User is not in the list.', ephemeral: true });
			}
			else {
				const broadcaster = await twitch.apiClient.users.getUserByName(user);
				await twitch.apiClient.eventSub.deleteSubscription(broadcaster.id);
				logger.info(`LOGGING: Unsubscribed from twitch user: ${broadcaster.name}`);

				const filtered = users.filter(e => e !== user);
				db.set('twitch_users', filtered);
				logger.info(`LOGGING: List of subscribed twitch users: ${db.get('twitch_users')}`);
				interaction.reply({ content: `${user} has been removed from the list.`, ephemeral: true });
			}
		}

		if (interaction.options.getSubcommand() === 'list') {
			const array = db.get('twitch_users').join(', ');
			logger.info(`LOGGING: List of subscribed twitch users: ${array}`);
			interaction.reply({ content: array });
		}

		if (interaction.options.getSubcommand() === 'channel') {
			const alertChannel = db.get('alert_channel');
			const currentChannel = interaction.channel.id;

			if (alertChannel !== currentChannel) {
				db.set('alert_channel', currentChannel);
				logger.info(`LOGGING: Set twitch alert channel to: ${currentChannel}`);
				interaction.reply({ content: 'Live channel set.', ephemeral: true });
			}
			else {
				interaction.reply({ content: 'Alerts are already being pushed to this channel.', ephemeral: true });
			}
		}

		if (interaction.options.getSubcommand() === 'help') {
			const embed = new MessageEmbed()
				.setTitle('Help list for /alert')
				.setColor('PURPLE')
				.setDescription('**Commands**')
				.addFields(
					{ name: '`/alert add <username>`', value: 'Add a twitch streamer to the list.' },
					{ name: '`/alert remove <username>`', value: 'Remove a twitch streamer from the list.' },
					{ name: '`/alert list`', value: 'Displays a list of twitch users currently subscribed to.' },
					{ name: '`/alert channel`', value: 'Changes the channel where notifications are pushed.' },
					{ name: '`/alert role`', value: 'Changes the role that\'s pinged when a streamer goes live.' },
					{ name: '`/alert help`', value: 'Displays this embed.' },
				);
			interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (interaction.options.getSubcommand() === 'role') {
			const role = interaction.options.getRole('role');
			db.set('ping_role', role.id);
			logger.info(`LOGGING: Set pinging role for twitch notifications: ${role.name}, ${role.id}`);
			interaction.reply({ content: 'Set role to ping.', ephemeral: true });
		}
	},
};
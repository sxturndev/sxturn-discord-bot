require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const logger = require('./logger');
const db = require('quick.db');

const client = new Client({
	restTimeOffset: 0,
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
module.exports = client;

client.once('ready', () => {
	logger.info('Bot ready.');

	// Check if logging channel is set.
	if (!db.get('log_channel')) {
		logger.warn('Logging channel not found. Please set a logging channel.');
		db.set('log_channel', '');
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		logger.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('error', (err) => {
	logger.error(err);
});

client.on('shardError', (err) => {
	logger.error('A websocket connection encountered an error.');
	logger.error(err);
});

process.on('unhandledRejection', err => {
	logger.error('Unhandled promise rejection.');
	logger.error(err);
});

client.login(process.env.TOKEN);
require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const logger = require('./logger');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	logger.info('Bot online!');
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

// Read command and event files for handling.
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

client.login(process.env.TOKEN);
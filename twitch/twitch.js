require('dotenv').config();
const logger = require('../logger');
const db = require('quick.db');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok');
const pushNotification = require('./pushNotification.js');
const editNotification = require('./editNotification.js');

const twitchId = process.env.TWITCH_ID;
const twitchSecret = process.env.TWITCH_SECRET;
const authProvider = new ClientCredentialsAuthProvider(twitchId, twitchSecret);
const apiClient = new ApiClient({ authProvider });

const listener = new EventSubListener({
	apiClient,
	adapter: new NgrokAdapter(),
	secret: process.env.TWITCH_EVENTSUB_SECRET,
});

async function doSubscriptions(client) {
	await apiClient.eventSub.deleteAllSubscriptions();
	await listener.listen();
	await subscribeToTwitchUsers(client);
}

async function newOnlineSub(twitch_user, client) {
	logger.info(`EVENTSUB: Subscribed to twitch user: ${twitch_user.name}`);
	await listener.subscribeToStreamOnlineEvents(twitch_user, e => {
		logger.info(`TWITCH STREAMS: ${e.broadcasterDisplayName} just went live!`);
		pushNotification(twitch_user, client);
	});
}

async function newOfflineSub(twitch_user, client) {
	await listener.subscribeToStreamOfflineEvents(twitch_user, e => {
		logger.info(`TWITCH STREAMS: ${e.broadcasterDisplayName} just went offline.`);
		editNotification(twitch_user, client);
	});
}

async function subscribeToTwitchUsers(client) {
	if (!db.get('twitch_users')) db.set('twitch_users', []);
	const users = db.get('twitch_users');

	for (let user of users) {
		user = await apiClient.users.getUserByName(user);
		if (!user) {return;}
		else {
			await newOnlineSub(user, client);
			await newOfflineSub(user, client);
		}
	}
}

module.exports.doSubscriptions = doSubscriptions;
module.exports.apiClient = apiClient;
module.exports.newOnlineSub = newOnlineSub;
module.exports.newOfflineSub = newOfflineSub;
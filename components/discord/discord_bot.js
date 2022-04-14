const fs = require('fs');
require('dotenv').config();

const Twitter = require('../twitter');
const FileHelper = require('../helpers/FileHelper');

const { Client, Intents } = require('discord.js');
const path = require('path');

const eventFilePath = path.resolve(__dirname, './events');

class TwitterImageUploader extends Client {
	constructor() {
		super(
			{
				intents: [
					Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS,
					Intents.FLAGS.GUILD_MESSAGES,
					Intents.FLAGS.DIRECT_MESSAGES,
					Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				],
				partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
			},
		);

		this.twitter = new Twitter();

		// Create required folder and files
		FileHelper.createTemporaryImageFolder();
		FileHelper.createTwitterDiscordMessagesLogFile();
		FileHelper.createAlreadyReveivedInfoMessageUserIDsFile();

		this.loadEvents();

		// Login to Discord with your client's secret_token
		if (!this.login(process.env.DISCORD_SECRET_TOKEN)) {
			console.log('Bot can not connect. Please check your secret key.');
		}
	}

	loadEvents() {
		const eventFiles = fs.readdirSync(eventFilePath).filter(file => file.endsWith('.js'));
		for (const file of eventFiles) {
			const event = require(`${eventFilePath}/${file}`);
			if (event.once) {
				this.once(event.name, (...args) => event.execute(...args));
			}
			else {
				this.on(event.name, (...args) => event.execute(...args, this.twitter));
			}
		}
	}
}

module.exports = TwitterImageUploader;

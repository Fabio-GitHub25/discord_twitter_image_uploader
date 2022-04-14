const Twit = require('twit');
require('dotenv').config();

const FileHelper = require('./helpers/FileHelper');

const {
	TEMPORARY_IMAGE_FOLDER_NAME,
	TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME, AUTHORIZED_DISCORD_USER_IDS,
} = require('./helpers/constants');

class Twitter extends Twit {
	constructor() {
		super(
			{
				consumer_key: process.env.TWITTER_CONSUMER_KEY,
				consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
				access_token: process.env.TWITTER_ACCESS_TOKEN,
				access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
			},
		);
	}

	retweetTweet(link) {
		const [, , twitterId] = link.match('/(status/([0-9]+))/') ?? [0, 0, 0];
		if (twitterId) {
			this.post('statuses/retweet', { id: twitterId }, () => {
				console.log('Retweeted successfully!');
			});
		}
		else {
			console.log('No valid twitter link provided');
		}
	}

	uploadImage(authorId, messageId) {
		const filePath = `${TEMPORARY_IMAGE_FOLDER_NAME}/${FileHelper.getImageNameTemplate(authorId, messageId)}`;
		const base64EncodedFileContent = FileHelper.getBase64EncodedFileContent(filePath);
		this.post(
			'media/upload',
			{ media_data: base64EncodedFileContent },
			(err, data) => {
				const tweet = {
					status: 'Posted new image from discord ',
					media_ids: [data.media_id_string],
				};

				if (err) {
					console.log('Image upload failed:', err);
				}
				else {
					console.log('Image uploaded, now tweeting it...');
				}

				this.post('statuses/update', tweet, (err, updateData) => {
					if (err) {
						console.log('Image posting failed:', err);
					}
					else {
						console.log('Successfully posted an image!');
						FileHelper.deleteFile(filePath);
						FileHelper.saveFileData({ authorId, messageId, tweetId: updateData.id_str }, TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME);
					}
				});
			},
		);
	}

	revokeTweet(userId, messageId) {
		const twitterDiscordMessages = FileHelper.getFileData(TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME);
		const twitterDiscordMessage = twitterDiscordMessages.find((message) => {
			return message.messageId === messageId && (message.authorId === userId || AUTHORIZED_DISCORD_USER_IDS.includes(userId));
		});

		if (twitterDiscordMessage) {
			this.post(
				'statuses/destroy/:id',
				{ id: twitterDiscordMessage.tweetId },
				(err) => {
					if (err) {
						console.log('Couldn\'t delete tweet', err);
					}
					else {
						console.log('Tweet deleted');
						const twitterDiscordMessageIndex = twitterDiscordMessages.indexOf(twitterDiscordMessage);
						twitterDiscordMessages.splice(twitterDiscordMessageIndex, 1);
						FileHelper.saveFileDataWithOverride(twitterDiscordMessages, TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME);
					}
				},
			);
		}
		else {
			console.log('Tweet not found');
		}
	}
}

module.exports = Twitter;
const FileHelper = require('../../helpers/FileHelper');
const {
	LISTEN_TO_DISCORD_CHANNEL_IDS,
	AUTHORIZED_DISCORD_USER_IDS, TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME,
} = require('../../helpers/constants.js');


module.exports = {
	name: 'messageReactionAdd',
	once: false,
	async execute(reaction, user, twitter) {
		if (LISTEN_TO_DISCORD_CHANNEL_IDS.length === 0 || LISTEN_TO_DISCORD_CHANNEL_IDS.includes(reaction.message.channel.id)) {
			if (reaction.partial) {
				try {
					await reaction.fetch();
				}
				catch (error) {
					console.error('Something went wrong when fetching the message:', error);
					return;
				}
			}

			if (
				!user.bot
                && isUserAuthorOrAuthorized(user.id, reaction.message.id)
                && reaction.emoji.name === '🗑️'
			) {
				reaction.message.delete();
				twitter.revokeTweet(user.id, reaction.message.id);
			}
			else {
				console.log('User is unauthorized nor an user nor the reaction is a trashcan');
			}
		}
	},
};

function isUserAuthorOrAuthorized(userId, messageId) {
	const twitterDiscordMessages = FileHelper.getFileData(TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME);
	return twitterDiscordMessages.some((message) => {
		return message.messageId == messageId && (message.authorId == userId || AUTHORIZED_DISCORD_USER_IDS.includes(userId));
	});
}
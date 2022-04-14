const pathHelper = require('path');
const LOGS_FOLDER_NAME = 'logs';

module.exports = {
	'VALID_PICTURE_FORMATS': ['png', 'jpg', 'jpeg'],
	'LISTEN_TO_DISCORD_CHANNEL_IDS': [],
	'AUTHORIZED_DISCORD_USER_IDS': [],
	'TEMPORARY_IMAGE_FOLDER_NAME': 'temporary_images',
	'TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME': pathHelper.join(LOGS_FOLDER_NAME, 'twitterDiscordMessagesLog.json'),
	'ALREADY_RECEIVED_DM_USER_IDS_FILE_NAME': pathHelper.join(LOGS_FOLDER_NAME, 'alreadyReceivedInfoMessageUserIds.json'),
};
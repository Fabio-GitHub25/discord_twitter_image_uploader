const { MessageEmbed } = require('discord.js');
const FileHelper = require('../../helpers/FileHelper');
const {
	LISTEN_TO_DISCORD_CHANNEL_IDS,
	ALREADY_RECEIVED_DM_USER_IDS_FILE_NAME,
} = require('../../helpers/constants.js');

module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message, twitter) {
		if (LISTEN_TO_DISCORD_CHANNEL_IDS.length === 0 || LISTEN_TO_DISCORD_CHANNEL_IDS.includes(message.channel.id)) {
			// If the user posts a twitter link, it will be retweeted by the bot.
			const isTwitterLinkPattern = /((https?:\/\/)(www\.)?twitter)/;
			if (message.content && isTwitterLinkPattern.test(message.content)) {
				twitter.retweetTweet(message.content);
			}

			const imageUrls = [];
			message.attachments.forEach((attachment) => {
				if (FileHelper.isAttachmentAnImage(attachment)) {
					message.react('🗑️');
					const alreadyReceivedDMUserIds = FileHelper.getFileData(ALREADY_RECEIVED_DM_USER_IDS_FILE_NAME);
					if (!alreadyReceivedDMUserIds.includes(message.author.id)) {
						sendUserAutomaticallyTwitterPostInfo(message);

						FileHelper.saveFileData(message.author.id, ALREADY_RECEIVED_DM_USER_IDS_FILE_NAME);
					}

					imageUrls.push(attachment.url);
				}
				else {
					console.log('File is not an image!');
				}
			});

			imageUrls.forEach((imageUrl) => {
				FileHelper.storeImageInTmpFolder(
					imageUrl,
					FileHelper.getImageNameTemplate(message.author.id, message.id),
				).then(() => {
					twitter.uploadImage(message.author.id, message.id);
				});
			});
		}
	},
};

function sendUserAutomaticallyTwitterPostInfo(message) {
	const messageEmbed = new MessageEmbed()
		.setTitle('Thank you for sharing your success!')
		.setDescription(`Your success will automatically be posted on our Twitter \n
			If you want to remove your post make sure to use the 🗑️ beneath your post. \n
			Otherwise the post will remain on our Twitter account.`,
		);

	message.author.send({ embeds: [messageEmbed] });
}
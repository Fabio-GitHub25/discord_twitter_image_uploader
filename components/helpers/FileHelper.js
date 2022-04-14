const fs = require('fs');
const https = require('https');
const {
	VALID_PICTURE_FORMATS,
	TEMPORARY_IMAGE_FOLDER_NAME,
	TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME,
	ALREADY_RECEIVED_DM_USER_IDS_FILE_NAME,
} = require('./constants');

class FileHelper {
	static createFile(fileName) {
		if (!fs.existsSync('./' + fileName)) {
			fs.closeSync(fs.openSync('./' + fileName, 'a'));
			fs.writeFileSync(fileName, '[]');
		}
	}

	static createTemporaryImageFolder() {
		if (!fs.existsSync(TEMPORARY_IMAGE_FOLDER_NAME)) {
			fs.mkdirSync(TEMPORARY_IMAGE_FOLDER_NAME);
		}
	}

	static createTwitterDiscordMessagesLogFile() {
		FileHelper.createFile(TWITTER_DISCORD_MESSAGES_LOG_FILE_NAME);
	}

	static createAlreadyReveivedInfoMessageUserIDsFile() {
		FileHelper.createFile(ALREADY_RECEIVED_DM_USER_IDS_FILE_NAME);
	}

	static isAttachmentAnImage(attachmentMessage) {
		const attachmentUrl = attachmentMessage.url.toLowerCase();
		return VALID_PICTURE_FORMATS.some((pictureFormat) => attachmentUrl.includes(pictureFormat));
	}

	static getFileData(fileName) {
		return JSON.parse(fs.readFileSync(fileName));
	}

	static saveFileData(data, fileName) {
		const existingData = FileHelper.getFileData(fileName);
		existingData.push(data);

		const result = JSON.stringify(existingData);
		fs.writeFileSync(fileName, result);
	}

	static saveFileDataWithOverride(data, fileName) {
		const result = JSON.stringify(data);
		fs.writeFileSync(fileName, result);
	}

	static storeImageInTmpFolder(imageUrl, imageName) {
		const tmpImagePath = `${TEMPORARY_IMAGE_FOLDER_NAME}/${imageName}`;
		const file = fs.createWriteStream(tmpImagePath);
		return new Promise((resolve) => {
			https.get(imageUrl, (response) => {
				response.pipe(file).on('finish', () => {
					resolve();
				});
			});
		});
	}

	static getImageNameTemplate(authorId, messageId) {
		return `${authorId}-${messageId}.png`;
	}

	static getBase64EncodedFileContent(filePath) {
		return fs.readFileSync(filePath, { encoding: 'base64' });
	}

	static deleteFile(path) {
		try {
			fs.unlinkSync(path);
		}
		catch (err) {
			console.error(err);
		}
	}
}

module.exports = FileHelper;
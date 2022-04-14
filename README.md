# Discord Twitter image uploader
Automatic image uploader from Discord to Twitter 

Code used for [@HelixCooked](https://twitter.com/HelixCooked)
## Overview
__Used technologies:__
- [Node.js](https://nodejs.org/en/)
- [Discord.js v13](https://discordjs.guide/#before-you-begin)
- [Twit.js](https://www.npmjs.com/package/twit)
- [ESLint](https://eslint.org/)

Node.js uses an event-driven architecture, making it possible to execute code when a specific event occurs.The discord.js library takes full advantage of this.

__Main tasks of the script:__
1. Retweet tweet
   - Listen to specific channel(s) if a new message with a Twitter link has been posted
   - Retweet given tweet link
2. Image Upload
   - Listen to certain Discord channel(s) if a new message with an image has been posted
   - Download image from Discord channel
   - Upload image on Twitter
3. Delete tweets
   - Listen to certain channels to see if there was a reaction to an already posted image with a trash can (🗑️)
   - Check if reaction was added by the author or explicit authorized user
   - Delete unwanted tweet

## Setup
__Required Node.js version 16.6+__
1. Clone the Git repository (and install / update Node.js if you don't have it already)
2. Create a __.env__ file in the root directory and add the following properties
    ```
    DISCORD_SECRET_TOKEN=<Your Discord secret token>
    TWITTER_CONSUMER_KEY=<Your Twitter consumer key>
    TWITTER_CONSUMER_SECRET=<Your Twitter consumer secret>
    TWITTER_ACCESS_TOKEN=<Your Twitter access token>
    TWITTER_ACCESS_TOKEN_SECRET=<Your Twitter access token secret>
    ```
3. Edit the following properties in /components/helpers/constants.js
   ```
   'LISTEN_TO_DISCORD_CHANNEL_IDS': [],
   'AUTHORIZED_DISCORD_USER_IDS': [],
   ```
   | Property name  | Type  | Description  | Valid value
   |---|---|---|---|
   | LISTEN_TO_DISCORD_CHANNEL_IDS  | Array  | Discord channel ids which should be listen to  | ['123', ...]  |
   | AUTHORIZED_DISCORD_USER_IDS  | Array  | Discord user ids which can delete any discord message | ['123', ...]  |

   *Read "[Usage](#usage)" section for more detailed explanation*
4. Install the required packages
   ```
    npm install
   ```
5. Run the script
   ```
    node main.js
   ```
    *To stop the script use __CTRL + C__*

## Usage
The script will run 24/7 if you started it once.

Then the Discord bot listens for various events in the channels you specified earlier (LISTEN_TO_DISCORD_CHANNEL_IDS).

1. __Message create [event](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageCreate):__

    When a new message is created, the script checks if the message contains a valid Twitter link and / or an image.

    If it contains a Twitter link it will be retweeted automatically.

    If the message contains an image, the image is downloaded from Discord and uploaded to Twitter. After that, the bot sends a DM to the user that their image has been uploaded to Twitter.

    In addition, an entry is made in the logs to ensure any possible future deletion of a tweet.

2. __Message reaction add [event](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionAdd):__

    When a new reaction to an already posted image is added in Discord, the script checks if the user adding the reaction is the author of the message or an explicit authorized user (AUTHORIZED_DISCORD_USER_IDS) __AND__ the reaction is a trash can (🗑️).

    If everything is correct, the image and the message will be deleted from Discord and Twitter.

__"logs"__ folder contains
- "alreadyReceivedInfoMessageUserIds.json" - list of user ids that have already received a DM from the bot that their image has been uploaded to Twitter
- "twitterDiscordMessagesLog.json" - mapping of uploaded images on Twitter (Discord author id, Discord message id, Tweet id)



## Resources
- [Node.js](https://nodejs.org/en/)
- [Discord.js v13](https://discordjs.guide/#before-you-begin)
- [Twit.js](https://www.npmjs.com/package/twit)
- [ESLint](https://eslint.org/)

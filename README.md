# d.js-v14-multi-bot
Run multiple unique bots per guild under one. You got full control over every command or event.
Note this is just for a few guilds!

## config.json
Rename `empty-config.json` to `config.json` and fill in the details.
- `status` use `dev` for local development and `prod` for production.
- `clientId` is the bots ID.
- `token` is your bots token provided by discord.
- `adminContactUrl` change it so people can contact you.
- `masterGuild` is the guildId for master functions like the feeback form.
- `systemLog` set true to activate the discord webhook.
- `systemLogWebhook` fill in the discord webhook url.
- `feedbackChannelId` is the channelId for the feedback form.
- `conLogStartMsg` set to `true` for startup message displaying the settings and `false` to disable.
- `conLogError` set to `true` for logging errors and `false` to disable.
- `conLogOK` set to `true` for logging success and `false` to disable.
- `conLogWarning` set to `true` for logging warnings and `false` to disable.
- `conLogObject` set to `true` for logging objects and `false` to disable.
- `conLogColor` set to `true` for coloring the logs and `false` to disable.
- `botStartNotificationForGuilds` set it to `false` for local development so you dont spam the start notification channels. And set it to `true` for production, else the function doesn't work.

Also make sure to fill in the `guild-config.json` per guild folder.

`npm i` for install
`npm run dev` for nodemon local development
`npm start` for production

global folder is for set global functions
guilds folder contains guildId specific functions

If the guild doesn't have a `setup.js` command, it will say they have a global install even tho they have a unique guild bot. So always make sure a new guild folder contains a setup.js command. Also make sure to fill in the `guild-config.json` per guild folder. Check out the guilds-folder-template to ensure you have all the needed files for a guild bot. The guild folder should be name with the corresponding guildID.

```text
djs-v14-multi-bot/
├─ global/
│  ├─ commands/
│  │  ├─ help.js
│  │  └─ setup.js
│  └─ events/
│     └─ ready.js
├─ guilds/
│  ├─ guilds-folder-template/
│  │  ├─ commands/
│  │  │  └─ help.js
│  │  │  └─ setup.js
│  │  ├─ events/
│  │  │  └─ ready.js
│  │  └─ guild-config.json
│  └─ 1234567890987654/
│     ├─ commands/
│     │  └─ help.js
│     │  └─ setup.js
│     ├─ events/
│     │  └─ ready.js
│     └─ guild-config.json
├─ index.js
├─ config.json
└─ README.md
```

## Global functions
- Post the word `codump` anywhere and the bot will auto-react ♻️🍻!
- `/help` you can't go without a global help function.
- `/setup` for admins only, so they can check the status of their bot.
- Global/Master feedback form underneath the help menu to contact you.
- Global/Master system logging with post via webhook to discord. *(default: disabled)* 
- Start notification for each guild when their bot is online.

## Unique guild functions
- Post the server name anywhere and the bot will auto-react 👍!
- `/help` a guide for users and for admins seperately and unique for each guild.
- `/setup` for admins only, so they can check the status of the bot and setup their unique features.
- Custom ticket system.
- Self assigned roles via reactions.

## Updates
We recommend you to join our [development server](https://codump.github.io/go/discord/) and use the follow option in the github-releases channel. That way you get a notification on your own discord when there is an update for this script. Or get the @Release ping in our roles channel to get pinged on our discord. 

## Logging
Full documentation can be found on: [ConLog Docs](https://codump.github.io/conlog/docs/#detailed-example)
const { Client, Intents, Collection } = require("discord.js");
const config = require("./config.js");
const { loadCommands, loadInteractions, loadEvents, logError } = require("./handlers.js");
const deployCommands = require('./deploy.js');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

client.setMaxListeners(0);
client.cooldowns = new Collection();
client.queues = new Collection();

(async () => {
    await Promise.all([loadCommands(client), loadInteractions(client), loadEvents(client)]);

    process.on('uncaughtException', error => logError(client, 'uncaughtException', error));
    process.on('unhandledRejection', reason => logError(client, 'unhandledRejection', reason));

    await deployCommands();

    const token = process.env.TOKEN || config.token;
    if (token) {
        client.login(token).catch(() => {
            console.error("The Bot Token You Entered Is Incorrect Or Your Bot's INTENTS Are OFF!");
        });
    } else {
        console.error("Please Provide A Valid Bot Token In The Environment Variables Or Config File!");
    }
})();

module.exports = client;
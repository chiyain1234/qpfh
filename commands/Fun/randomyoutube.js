const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { google } = require('googleapis');
const cmdName = "randomyoutube"
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUR_YOUTUBE_API_KEY
});

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 30,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("ランダムにYouTubeのURLを送信する。")
        .addStringOption(option => option
            .setName('language')
            .setDescription('言語を選択してください。')
            .setRequired(true)
            .addChoices({ name: '英語', value: 'en' }, { name: '日本語', value: 'jp' })),

    async execute(i) {
        await i.deferReply()

        if (i.options.getString('language') === ("jp")) {
            var randomLength = Math.floor(Math.random() * 10) + 1;
            var randomKeyword = generateRandomStringJp(randomLength);
        }
        if (i.options.getString('language') === ("en")) {
            var randomLength = Math.floor(Math.random() * 6) + 1;
            var randomKeyword = generateRandomString(randomLength);
        }
        try {

            var searchResponse = await youtube.search.list({
                part: 'id',
                type: 'video',
                maxResults: 50,
                q: randomKeyword
            });
        } catch (error) {
            await i.editReply('動画を取得できませんでした。後でもう一度お試しください。');
        }

        const randomIndex = Math.floor(Math.random() * searchResponse.data.items.length);
        const videoId = searchResponse.data.items[randomIndex].id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        await i.editReply(videoUrl);
    }
}

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}

function generateRandomStringJp(length) {
    const characters = 'あいうえおがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}
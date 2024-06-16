const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const translate = require('translatte');
const Memer = require('random-jokes-api');

const cmdName = 'chuck';

const createEmbed = (client, title, description, footer) => {
    return new MessageEmbed()
        .setColor(client.config.color)
        .setTitle(title)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: footer });
};

const getMemerText = async (type, toLang = 'ja') => {
    const text = Memer[type]();
    const res = await translate(text, { from: 'auto', to: toLang });
    return res.text;
};

const getAPIResponse = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('Some funs')
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Choose an option')
                .setRequired(true)
                .addChoices(
                    { name: 'advice', value: 'advice' },
                    { name: 'insult', value: 'insult' },
                    { name: 'name', value: 'name' },
                    { name: 'funny', value: 'funny' },
                    { name: 'joke', value: 'joke' },
                    { name: 'pun', value: 'pun' },
                    { name: 'roast', value: 'roast' },
                    { name: 'antijoke', value: 'antijoke' },
                    { name: 'quotes', value: 'quotes' },
                    { name: 'showerthought', value: 'showerthought' },
                    { name: 'trivia', value: 'trivia' },
                    { name: 'truth', value: 'truth' },
                    { name: 'dare', value: 'dare' },
                    { name: 'chucknorris', value: 'chucknorris' }
                )
        )
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Enter a name (required for "name" type)')
                .setRequired(false)
        ),

    async execute(i, client) {
        await i.deferReply();
        const type = i.options.getString('type');
        const name = i.options.getString('name');

        try {
            let text = '';
            let title = '';

            switch (type) {
                case 'advice':
                    const adviceData = await getAPIResponse('https://api.adviceslip.com/advice');
                    text = adviceData.slip.advice;
                    title = 'アドバイス';
                    break;
                case 'insult':
                    const insultData = await getAPIResponse('https://evilinsult.com/generate_insult.php?lang=en&type=json');
                    text = insultData.insult;
                    title = '侮辱ワード';
                    break;
                case 'name':
                    if (!name) {
                        await i.editReply({ content: 'エラー: 名前オプションが必要です。' });
                        return;
                    }
                    const nameData = await getAPIResponse(`https://api.genderize.io/?name=${name}`);
                    title = `${name}の性別`;
                    text = `名前: ${nameData.name}\n性別: ${nameData.gender}\n可能性: ${nameData.probability * 100}%`;
                    if (nameData.gender === null) {
                        title = 'エラー';
                        text = `その名前は判別出来ません。\nローマ字表記でお試しください。`;
                    }
                    break;
                case 'funny':
                    const funnyData = await getAPIResponse('https://corporatebs-generator.sameerkumar.website/');
                    text = funnyData.phrase;
                    title = 'ファニー';
                    break;
                default:
                    const memerType = {
                        truth: 'truth',
                        dare: 'dare',
                        trivia: 'trivia',
                        chucknorris: 'chuckNorris',
                        showerthought: 'showerThought',
                        quotes: 'quotes',
                        antijoke: 'antijoke',
                        roast: 'roast',
                        pun: 'pun',
                        joke: 'joke'
                    }[type];
                    text = await getMemerText(memerType);
                    title = {
                        truth: '事実を言ってください',
                        dare: 'あなたはこれをする勇気はありますか？',
                        trivia: 'トリビア',
                        chucknorris: 'チャック・ノリス',
                        showerthought: 'シャワーソート',
                        quotes: '名言',
                        antijoke: '切れ芸',
                        roast: 'からかいのお言葉',
                        pun: 'ダジャレ',
                        joke: 'ジョーク'
                    }[type];
                    break;
            }

            const translated = await translate(text, { from: 'auto', to: 'ja' });
            const embed = createEmbed(client, title, translated.text, `/${cmdName}`);
            await i.editReply({ embeds: [embed] });
        } catch (err) {
            console.error(err);  // エラーの詳細をコンソールに出力
            const errorEmbed = createEmbed(client, 'エラー', '取得出来ませんでした。', `/${cmdName}`);
            await i.editReply({ embeds: [errorEmbed] });
        }
    }
};

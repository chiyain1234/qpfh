const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const lenny = require('lenny');

const cmdName = 'rest';

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('ひといきコマンド')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choose an option')
                .setRequired(true)
                .addChoices(
                    { name: 'yesno', value: 'yesno' },
                    { name: 'kaomoji', value: 'kaomoji' },
                    { name: 'laughmoji', value: 'laughmoji' },
                    { name: 'lenny', value: 'lenny' },
                    { name: 'oicyammy', value: 'oicyammy' },
                    { name: 'splitedeshow', value: 'splitedeshow' },
                    { name: 'von', value: 'von' },
                    { name: 'clap', value: 'clap' }
                ))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('文字を入力してください')
                .setRequired(false)),

    async execute(i, client) {
        await i.deferReply();
        const type = i.options.getString('type');
        const text = i.options.getString('text');
        const apiGet = async (url) => (await axios.get(url)).data;
        const sendEmbed = async (title, description, image) => {
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTitle(title)
                .setDescription(description)
                .setImage(image)
                .setTimestamp()
                .setFooter({ text: i.toString() });
            await i.editReply({ embeds: [embed] });
        };

        try {
            switch (type) {
                case 'yesno':
                    const yesno = await apiGet('https://yesno.wtf/api');
                    await sendEmbed(yesno.answer, '', yesno.image);
                    break;
                case 'kaomoji':
                    const kaomoji = await apiGet('https://raw.githubusercontent.com/chiyain1234/kaomoji/main/kaomoji.json');
                    await i.editReply(kaomoji[Math.floor(Math.random() * kaomoji.length)].face);
                    break;
                case 'laughmoji':
                    const laughmoji = await apiGet('https://yapi.ta2o.net/apis/warosuapi.cgi?format=json');
                    await i.editReply(laughmoji.str);
                    break;
                case 'lenny':
                    await i.editReply(lenny());
                    break;
                case 'oicyammy':
                    await sendEmbed('', '美味しいヤミー❗️✨🤟😁👍✨⚡️感謝❗️🙌✨感謝❗️🙌✨またいっぱい食べたいな❗️🥓🥩🍗🍖😋🍴✨デリシャッ‼️🙏✨ｼｬ‼️🙏✨ ｼｬ‼️🙏✨ ｼｬ‼️🙏✨ ｼｬ‼️🙏✨ ｼｬｯｯ‼😁🙏✨ハッピー🌟スマイル❗️❗️💥✨👉😁👈⭐️');
                    break;
                case 'splitedeshow':
                    await sendEmbed('', 'スプライトでしょ ドゥン　ドミニ―　で転売　丁度４語　ドミニ― 4・4 具合悪い toダニ DDチンちょな 蒸留水', 'https://cdn.discordapp.com/attachments/1001354677226590308/1076797030367764490/super-idol-social-credits.gif');
                    break;
                case 'von':
                    const vonText = text || "ﾌﾞｫﾝ";
                    const vonArr = ["(っ´∀`)╮ =͟͟͞", "(っ'-')╮=͟͟͞", "三╰( `•ω•)╮-=ﾆ=一＝三", "(っˊᵕˋ)╮=͟͟͞", "(Ｕ 'ᴗ' )⊃≡", "( っ'ヮ')╮ =͟͟͞三", "╰( ^o^)╮-=ニ=", "╰(　`^´ )╮-=ﾆ=一＝三", "(ﾉ*˙˘˙)ﾉ =͟͟͞", "╰( 　T□T)╮-=ﾆ=一＝三", "(´･Д･)╮ =͟͟͞"];
                    await sendEmbed('', `${vonArr[Math.floor(Math.random() * vonArr.length)]}${vonText}`);
                case 'clap':
                    const clapText = text || "clap";
                    await sendEmbed('', `👏${clapText}👏`);
                    break;
            }
        } catch (err) {
            const errorEmbed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTitle('エラー')
                .setDescription('取得出来ませんでした。')
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });
            await i.editReply({ embeds: [errorEmbed] });
        }
    }
};

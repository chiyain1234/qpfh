const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const translate = require("translatte");

const cmdName = "retranslate";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("指定された回数分ランダムな言語で翻訳し、最終的に日本語にします。")
        .addStringOption(option => option
            .setName('text')
            .setDescription('文字を入力してください。')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('times')
            .setDescription('翻訳する回数を選択してください。')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(50)),

    async execute(interaction, client) {
        const times = interaction.options.getInteger('times')||getRandomNumberString()
        const text = interaction.options.getString('text');

        let translatedText = text;
        let from = 'auto';
        let to = 'ja';
        let progress = 0;
        let translatedLanguages = [];

        try {
            const initialEmbed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`${times} 回の逆翻訳`)
                .setDescription(`翻訳の進行度: ${progress}/${times}`)
                .addFields({ name: '使用言語', value: `日本語→`, inline: false }, 
                           { name: '元のテキスト', value: text, inline: false })
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });

            const initialMessage = await interaction.reply({ embeds: [initialEmbed], fetchReply: true });

            // Wait for the initial message to be sent before starting translations
            await initialMessage;

            for (let i = 0; i < times; i++) {
                progress++;

                const randomLang = getRandomLanguage();
                const res = await translate(translatedText, { from, to: randomLang });
                translatedText = res.text;
                from = randomLang;

                translatedLanguages.push(`${langs[from]}`); // Add to the end of the array

                var languageDescription = translatedLanguages.join('→');

                const embed = new MessageEmbed()
                    .setColor(client.config.color)
                    .setTitle(`${times} 回の逆翻訳`)
                    .setDescription(`翻訳の進行度: ${progress}/${times}`)
                    .addFields({ name: '使用言語', value: `日本語→${languageDescription}`, inline: false }, 
                               { name: '元のテキスト', value: text, inline: false }, 
                               { name: '翻訳', value: translatedText, inline: false })
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });

                await initialMessage.edit({ embeds: [embed] });

                await sleep(1000);
            }

            // 最終的なテキストを日本語に翻訳
            const finalRes = await translate(translatedText, { from, to });
            translatedText = finalRes.text;

            // Update the embed with the final translation and all used languages
            const finalEmbed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`${times} 回の逆翻訳`)
                .setDescription(`逆翻訳完了`)
                .addFields({ name: '使用言語', value: `日本語→${languageDescription}→日本語`, inline: false },  
                           {name: '元のテキスト', value: text, inline: false }, 
                           { name: '最終的な翻訳', value: translatedText, inline: false })
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });

            await initialMessage.edit({ embeds: [finalEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle("エラー")
                .setDescription("翻訳に失敗しました。もう一度お試しください。");

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};

function getRandomLanguage() {
    const languages = Object.keys(langs);
    return languages[Math.floor(Math.random() * languages.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomNumberString() {
    // 1から10までのランダムな整数を生成
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    
    // 整数を文字列に変換
    return randomNumber.toString();
}

var langs = {
    'af': 'アフリカーンス語',
    'sq': 'アルバニア語',
    'am': 'アムハラ語',
    'ar': 'アラビア語',
    'hy': 'アルメニア語',
    'az': 'アゼルバイジャン語',
    'eu': 'バスク語',
    'be': 'ベラルーシ語',
    'bn': 'ベンガル語',
    'bs': 'ボスニア語',
    'bg': 'ブルガリア語',
    'ca': 'カタルーニャ語',
    'ceb': 'セブアノ語',
    'ny': 'チェワ語',
    'zh': '中国語（簡体）',
    'zh-cn': '中国語(簡体)',
    'zh-tw': '中国語(繁体)',
    'co': 'コルシカ語',
    'hr': 'クロアチア語',
    'cs': 'チェコ語',
    'da': 'デンマーク語',
    'nl': 'オランダ語',
    'en': '英語',
    'eo': 'エスペラント語',
    'et': 'エストニア語',
    'tl': 'フィリピン語',
    'fi': 'フィンランド語',
    'fr': 'フランス語',
    'fy': 'フリジア語',
    'gl': 'ガリシア語',
    'ka': 'ジョージア語',
    'de': 'ドイツ語',
    'el': 'ギリシャ語',
    'gu': 'グジャラート語',
    'ht': 'ハイチ語',
    'ha': 'ハウサ語',
    'haw': 'ハワイ語',
    'he': 'ヘブライ語',
    'iw': 'ヘブライ語',
    'hi': 'ヒンディー語',
    'hmn': 'モン語',
    'hu': 'ハンガリー語',
    'is': 'アイスランド語',
    'ig': 'イボ語',
    'id': 'インドネシア語',
    'ga': 'アイルランド語',
    'it': 'イタリア語',
    'ja': '日本語',
    'jw': 'ジャワ語',
    'kn': 'カンナダ語',
    'kk': 'カザフ語',
    'km': 'クメール語',
    'ko': '韓国語',
    'ku': 'クルド語',
    'ky': 'キルギス語',
    'lo': 'ラオ語',
    'la': 'ラテン語',
    'lv': 'ラトビア語',
    'lt': 'リトアニア語',
    'lb': 'ルクセンブルク語',
    'mk': 'マケドニア語',
    'mg': 'マダガスカル語',
    'ms': 'マレー語',
    'ml': 'マラヤーラム語',
    'mt': 'マルタ語',
    'mi': 'マオリ語',
    'mr': 'マラーティー語',
    'mn': 'モンゴル語',
    'my': 'ビルマ語',
    'ne': 'ネパール語',
    'no': 'ノルウェー語',
    'ps': 'パシュト語',
    'fa': 'ペルシャ語',
    'pl': 'ポーランド語',
    'pt': 'ポルトガル語',
    'pa': 'パンジャーブ語',
    'ro': 'ルーマニア語',
    'ru': 'ロシア語',
    'sm': 'サモア語',
    'gd': 'スコットランド・ゲール語',
    'sr': 'セルビア語',
    'st': 'ソト語',
    'sn': 'ショナ語',
    'sd': 'シンド語',
    'si': 'シンハラ語',
    'sk': 'スロバキア語',
    'sl': 'スロベニア語',
    'so': 'ソマリ語',
    'es': 'スペイン語',
    'su': 'スンダ語',
    'sw': 'スワヒリ語',
    'sv': 'スウェーデン語',
    'tg': 'タジク語',
    'ta': 'タミル語',
    'te': 'テルグ語',
    'th': 'タイ語',
    'tr': 'トルコ語',
    'uk': 'ウクライナ語',
    'ur': 'ウルドゥー語',
    'uz': 'ウズベク語',
    'vi': 'ベトナム語',
    'cy': 'ウェールズ語',
    'xh': 'コサ語',
    'yi': 'イディッシュ語',
    'yo': 'ヨルバ語',
    'zu': 'ズールー語'
};
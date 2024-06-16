const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const translate = require("translatte");

const cmdName = "translate";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("テキストを翻訳する。")
        .addStringOption(option => option
            .setName('from')
            .setDescription('翻訳する言語を選択してください。')
            .setRequired(true)
            .addChoices(
                { name: '言語を検出する', value: 'auto' },
                { name: '日本語', value: 'ja' },
                { name: '英語', value: 'en' },
                { name: '韓国語', value: 'ko' },
                { name: '中国語/簡体字', value: 'zh-cn' },
                { name: '中国語/繁体字', value: 'zh-tw' },
                { name: 'フランス語', value: 'fr' },
                { name: 'ドイツ語', value: 'de' },
                { name: 'ヒンディー語', value: 'hi' },
                { name: 'イタリア語', value: 'it' },
                { name: 'ロシア語', value: 'ru' },
                { name: 'ウクライナ語', value: 'uk' },
                { name: 'スペイン語', value: 'es' },
                { name: 'ポルトガル語', value: 'pt' },
                { name: 'スウェーデン語', value: 'sv' },
                { name: 'ノルウェー語', value: 'no' },
                { name: 'フィンランド語', value: 'fi' },
                { name: 'カナダ語', value: 'kn' },
                { name: 'アイスランド語', value: 'is' },
                { name: 'アラビア語', value: 'ar' },
                { name: 'ベトナム語', value: 'vi' },
                { name: 'オランダ語', value: 'nl' },
                { name: 'モンゴル語', value: 'mn' },
                { name: 'エスペラント語', value: 'eo' }
            ))
        .addStringOption(option => option
            .setName('to')
            .setDescription('翻訳先の言語を選択してください。')
            .setRequired(true)
            .addChoices(
                { name: '日本語', value: 'ja' },
                { name: '英語', value: 'en' },
                { name: '韓国語', value: 'ko' },
                { name: '中国語/簡体字', value: 'zh-cn' },
                { name: '中国語/繁体字', value: 'zh-tw' },
                { name: 'フランス語', value: 'fr' },
                { name: 'ドイツ語', value: 'de' },
                { name: 'ヒンディー語', value: 'hi' },
                { name: 'イタリア語', value: 'it' },
                { name: 'ロシア語', value: 'ru' },
                { name: 'ウクライナ語', value: 'uk' },
                { name: 'スペイン語', value: 'es' },
                { name: 'ポルトガル語', value: 'pt' },
                { name: 'スウェーデン語', value: 'sv' },
                { name: 'ノルウェー語', value: 'no' },
                { name: 'フィンランド語', value: 'fi' },
                { name: 'カナダ語', value: 'kn' },
                { name: 'アイスランド語', value: 'is' },
                { name: 'アラビア語', value: 'ar' },
                { name: 'ベトナム語', value: 'vi' },
                { name: 'オランダ語', value: 'nl' },
                { name: 'モンゴル語', value: 'mn' },
                { name: 'エスペラント語', value: 'eo' }
            ))
        .addStringOption(option => option
            .setName('text')
            .setDescription('文字を入力してください。')
            .setRequired(true)),

    async execute(i, client) {
        const from = i.options.getString('from');
        const to = i.options.getString('to');
        const text = i.options.getString('text');

        try {
            const res = await translate(text, { from, to });
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`${from} => ${to}`)
                .addFields(
                    { name: '原文', value: text, inline: false },
                    { name: '翻訳', value: res.text, inline: false }
                )
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });

            await i.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle("エラー")
                .setDescription("翻訳に失敗しました。もう一度お試しください。");

            await i.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};

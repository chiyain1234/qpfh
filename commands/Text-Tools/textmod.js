const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const Zalgo = require('to-zalgo');
const iconv = require('iconv-lite');
const morse = require('morse-decoder');
const { convertText, radicalKanji, oldKanji, convertFont, susText } = require('../../functions.js');

const cmdName = "textmod";

const createEmbed = (client, title, description, footer) => {
    return new MessageEmbed()
        .setColor(client.config.color)
        .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: footer, iconURL: '' });
};

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandBuilder()
        .setName(cmdName)
        .setDescription("テキストツール。")
        .addSubcommand(subcommand => subcommand
            .setName("gal-moji")
            .setDescription("文字をギャル文字に変換する。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("radical")
            .setDescription("漢字を部首分解する。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true).setMaxLength(1)))

        .addSubcommand(subcommand => subcommand
            .setName("zalgo")
            .setDescription("文字をカオスする。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("reverse")
            .setDescription("文字を逆にする。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("random")
            .setDescription("文字配列をランダムにする。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("length")
            .setDescription("文字数を数える。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("oldkanji")
            .setDescription("文字を旧字体に変換する。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("sus")
            .setDescription("文字を怪レく変換する。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("mcenchant")
            .setDescription("Minecraftのエンチャント文字に変換する。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("garble")
            .setDescription('文章を文字化けしたり、復元する。')
        .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true))
        .addBooleanOption(option =>
            option.setName('recover')
            .setDescription('文字化けを直すかどうかを選択します。')
            .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("font")
            .setDescription("英語のフォントを別のフォントに変換する。")
            .addStringOption(option => option
                .setName('font')
                .setDescription('フォントを選択してください。')
                .setRequired(true)
                .addChoices({ name: '𝐓𝐞𝐱𝐭', value: '1' }, { name: '𝑇𝑒𝑥𝑡', value: '2' }, { name: '𝑻𝒆𝒙𝒕', value: '3' }, { name: '𝗧𝗲𝘅𝘁', value: '4' }, { name: '𝘛𝘦𝘹𝘵', value: '5' }, { name: '𝙏𝙚𝙭𝙩', value: '6' }, { name: '𝕋𝕖𝕩𝕥', value: '7' }, { name: '🅣🅔🅧🅣', value: '8' }, { name: 'Ⓣⓔⓧⓣ', value: '9' }, { name: 'ᴛᴇxᴛ', value: '10' }, { name: '🆃🅴🆇🆃', value: '11' }, { name: '𝔗𝔢𝔵𝔱', value: '12' }, { name: '𝕿𝖊𝖝𝖙', value: '125' }, { name: '𝓣𝓮𝔁𝓽', value: '13' }, { name: 'ʇxǝꓕ', value: '14' }, { name: 'ꓕǝxʇ', value: '15' }, { name: 'ՇєאՇ', value: '16' }, { name: 'Tҽxƚ', value: '17' }, { name: 'ȶɛӼȶ', value: '18' }, { name: '𐌕𐌄𐋄𐌕', value: '19' }, { name: '⒯⒠⒳⒯', value: '20' }, { name: 'ᵗᵉˣᵗ', value: '21' }, { name: 'ᏖᏋጀᏖ', value: '22' }, { name: 'ｔｅｘｔ', value: '23' }, { name: 'ㄒ乇乂ㄒ', value: '24' }, ))
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("replace")
            .setDescription("指定した文字を別の文字列に置き換える。")
            .addStringOption(option => option.setName('text').setDescription('文章を入力してください。').setRequired(true))
            .addStringOption(option => option.setName('original').setDescription('元の文字列を入力してください。').setRequired(true))
            .addStringOption(option => option.setName('replacement').setDescription('置き換える文字列を入力してください。').setRequired(true)))
            
        .addSubcommand(subcommand => subcommand
            .setName("morse")
            .setDescription("文字をモールス信号に変換する。")
            .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true))
            .addStringOption(option => option
                .setName('choice')
                .setDescription('モールス信号にするかモールス信号を文字化するかを選択してください。')
                .setRequired(true)
                .addChoices({ name: 'モールス信号→文字', value: 'm2t' },{ name: '文字→モールス信号', value: 't2m' })))
            ,

    async execute(i, client) {
        const subCommand = i.options.getSubcommand();
        const text = i.options.getString('text');
        let context, title;

        switch (subCommand) {
            case 'mcenchant':
                context = convertFont(text, "25");
                title = `原文 | ${text}`;
                break;

            case 'length':
                context = `${text}`;
                title = `文字数 : ${text.length} 文字`;
                break;

            case 'random':
                context = text.split('').sort(() => Math.random() - 0.5).join('');
                title = `ランダム変換 | 原文: ${text}`;
                break;

            case 'reverse':
                context = text.split('').reverse().join('');
                title = `Reverse変換 | 原文: ${text}`;
                break;

            case 'zalgo':
                context = Zalgo(text);
                title = `Zalgo変換 | 原文: ${text}`;
                break;

            case 'radical':
                context = radicalKanji(text);
                title = `部首分解 | 原文: ${text}`;
                break;
                
            case 'sus':
                context = susText(text);
                title = `怪レい | 原文: ${text}`;
                break;

            case 'gal-moji':
                context = convertText(text);
                title = `ギャル文字変換 | 原文: ${text}`;
                break;

            case 'oldkanji':
                context = oldKanji(text);
                title = `旧字変換 | 原文: ${text}`;
                break;

            case 'font':
                const fontType = i.options.getString('font');
                context = convertFont(text, fontType);
                return i.reply(`${context}`);
                break;

            case 'garble':
                const reverse = i.options.getBoolean('recover');

                if (reverse) {
                    const shiftJISBuffer = Buffer.from(text, 'utf-8');
                    context = iconv.encode(shiftJISBuffer, 'Shift_JIS').toString();
                    title = `文字化けを直した結果 | 原文: ${text}`;
                } else {
                    const utf8Buffer = Buffer.from(text, 'utf-8');
                    const shiftJISText = iconv.decode(utf8Buffer, 'Shift_JIS');
                    context = iconv.encode(shiftJISText, 'utf-8').toString();
                    title = `文字化け結果 | 原文: ${text}`;
                }

                break;

            case 'replace':
                const original = i.options.getString('original');
                const replacement = i.options.getString('replacement');
                context = text.replaceAll(original, replacement);
                title = `置換結果 | 元の文字列: ${original} -> 置き換え文字列: ${replacement} | 元の文章: ${text}`;
                break;

            case 'morse':
                const choice = i.options.getString('choice');
                const coded = choice === "m2t" ? morse.encode(text) : choice === "t2m" ? morse.decode(text) : undefined;

                    title = `モールス結果 | 元の文字列: ${text}`;
                    context = `結果: ${coded}`
                    break;

            default:
                return i.reply({ content: "不明なコマンドです。", ephemeral: true });
        }

        const embed = createEmbed(client, title, context, i.toString());
        i.reply({ embeds: [embed] });
    }
};

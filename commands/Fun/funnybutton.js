const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');

const cmdName = "funnybutton";

const buttonDetails = {
    '1': { amount: "21", title: "見たら押すボタン", label: "見たね？押してね？", buttonNun: "fb_01", name: '見たら押すボタン' },
    '2': { amount: "31", title: "見たら絶対押すボタン", label: "いま目が合ったよね？", buttonNun: "fb_02", name: '見たら絶対押すボタン' },
    '3': { amount: "8", title: "押したら絵描くボタン", label: "描く？", buttonNun: "fb_03", name: '押したら絵描くボタン' },
    '4': { amount: "25", title: "声晒すボタン", label: "見たら押せ？", buttonNun: "fb_04", name: '声晒すボタン' },
    '5': { amount: "9", title: "摩訶不思議ボタン", label: "見たら押せ？ 当たり外れ激しいぞ？", buttonNun: "fb_05", name: '摩訶不思議ボタン' },
    '6': { amount: "26", title: "見たら絶対にやる(重め)ボタン", label: "やれ", buttonNun: "fb_06", name: '見たら絶対にやる(重め)ボタン' },
    '7': { amount: "35", title: "絵描きさん用のボタン", label: "気軽に押してね", buttonNun: "fb_07", name: '絵描きさん用のボタン' },
    '8': { amount: "50", title: "ボカロ歌いやがれくださいボタン", label: "逃げるなよ(^_^)", buttonNun: "fb_08", name: 'ボカロ歌いやがれくださいボタン' },
    '9': { amount: "7", title: "見たら３秒以内に押せボタン", label: "早くしろ早くしろ早くしろ", buttonNun: "fb_09", name: '見たら３秒以内に押せボタン' },
    '10': { amount: "17", title: "( ˙◁˙ 👐)視界に入った瞬間押す割と地獄なボタン", label: "押しなさいな★", buttonNun: "fb_10", name: '( ˙◁˙ 👐)視界に入った瞬間押す割と地獄なボタン' },
    '11': { amount: "19", title: "おいおい見ただろ？ちゃんと押せよ罰ゲームボタン", label: "( ＞o＜)ｷｬｰ", buttonNun: "fb_11", name: 'おいおい見ただろ？ちゃんと押せよ罰ゲームボタン' },
    '12': { amount: "21", title: "何か失う気がするボタン", label: "暇人はやれ", buttonNun: "fb_12", name: '何か失う気がするボタン' },
    '13': { amount: "12", title: "押したらやばいかもしれんボタン", label: "色々と種類ある☆", buttonNun: "fb_13", name: '押したらやばいかもしれんボタン' },
    '14': { amount: "11", title: "○rtで晒す地獄なボタン", label: "押せよ???", buttonNun: "fb_14", name: '○rtで晒す地獄なボタン' },
    '15': { amount: "46", title: "Hololiveボタン", label: "Hololive", buttonNun: "fb_15", name: 'Hololiveボタン' },
    '16': { amount: "23", title: "メス堕ち阻止チャレンジボタン", label: "君はメス堕ちしてしまうのか", buttonNun: "fb_16", name: 'メス堕ち阻止チャレンジボタン' },
    '17': { amount: "13", title: "たのしいたのしいボタン", label: "押すよね？", buttonNun: "fb_17", name: 'たのしいたのしいボタン' },
};

const commandBuilder = new SlashCommandSubcommandBuilder()
    .setName(cmdName)
    .setDescription("見たら押すボタン")
    .addStringOption(option => {
        const typeOption = option.setName('type')
            .setDescription('種類を選択してください。')
            .setRequired(true);
        
        for (const [key, value] of Object.entries(buttonDetails)) {
            typeOption.addChoices({ name: value.name, value: key });
        }

        return typeOption;
    })
    .addIntegerOption(option => 
        option.setName('times')
            .setDescription('ボタンを押せる回数を入力してください。 (1~50)')
            .setMinValue(1)
            .setMaxValue(50)
            .setRequired(false)
    );

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: commandBuilder,

    async execute(i, client) {
        const type = i.options.getString('type');
        const times = String(i.options.getInteger('times')||5);
        const { amount, title, label, buttonNun } = buttonDetails[type];

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(title)
            .setDescription(`結果パターン: ${amount} 通り`)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
            .setTimestamp()
            .setFooter({ text: times, iconURL: '' });

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buttonNun)
                    .setLabel(label)
                    .setStyle('PRIMARY')
            );

        await i.reply({ embeds: [embed], components: [button] });
    }
};

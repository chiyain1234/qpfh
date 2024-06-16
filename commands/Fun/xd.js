const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const cmdName = "xd"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("XD")
        .addStringOption(option => 
            option.setName('type')
                .setDescription('タイプを選択してください')
                .setRequired(true)
                .addChoices(
                    { name: 'liker', value: 'liker' },
                    { name: 'howpop', value: 'howpop' },
                    { name: 'howgay', value: 'howgay' },
                    { name: 'peenis', value: 'peenis' },
                    { name: 'howsimp', value: 'howsimp' },
                    { name: 'iq', value: 'iq' },
                    { name: 'disliker', value: 'disliker' },
                    { name: 'howdispop', value: 'howdispop' },
                    { name: 'howliar', value: 'howliar' },
                    { name: 'howpervert', value: 'howpervert' },
                    { name: 'howmarry', value: 'howmarry' },
                    { name: 'facerank', value: 'facerank' },
                    { name: 'bodyprice', value: 'bodyprice' },
                    { name: 'headscrew', value: 'headscrew' },
                    { name: 'girlrate', value: 'girlrate' },
                    { name: 'brain', value: 'brain' },
                    { name: 'height-weight', value: 'height-weight' },
                    { name: 'friends', value: 'friends' }
                )
        )
        .addUserOption(option => 
            option.setName('user')
                .setDescription('ユーザーを選択してください')
                .setRequired(false)
        ),

    async execute(i, client) {
        const createEmbed = (title, description) => {
            return new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(title)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: '' })
                .setDescription(description)
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
        };

        const user = i.options.getUser('user') || i.user;
        const getRandomAmount = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
        const type = i.options.getString('type');

        if (type === 'liker') {
            const amount = getRandomAmount(50);
            const embed = createEmbed(`${user.username}のことが好きな人`, `__${amount}人__`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'howpop' || type === 'howsimp' || type === 'howdispop') {
            const amount = getRandomAmount(100);
            let value;

            if (amount <= 10) value = "🤣";
            else if (amount > 10 && amount <= 30) value = "🥱";
            else if (amount > 30 && amount <= 60) value = "😝";
            else if (amount > 60 && amount <= 90) value = "😁";
            else value = "😇";

            const typeMap = {
                howpop: '人気度',
                howsimp: '頭の悪さ',
                howdispop: '不人気度'
            };

            const embed = createEmbed(`${user.username}の${typeMap[type]}`, `__${amount}%__ ${typeMap[type]}!! ${value}`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'howgay') {
            const amount = getRandomAmount(100);
            const embed = createEmbed(`${user.username}`, `__${amount}%__ Gay!! 🏳️‍🌈`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'peenis') {
            const amount = getRandomAmount(10);
            const long = "=".repeat(amount);
            const embed = createEmbed(`${user.username}'s pe... size`, `8${long}D`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'iq') {
            const amount = getRandomAmount(160, 50);
            const embed = createEmbed(`${user.username}`, `__IQ ${amount}__!!`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'disliker') {
            const amount = getRandomAmount(50);
            const embed = createEmbed(`${user.username}のことが嫌いな人`, `__${amount}人__`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'howliar') {
            const amount = getRandomAmount(105);
            const embed = createEmbed(`${user.username}`, `__${amount}/100__ 嘘つき!!`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'howpervert') {
            const amount = getRandomAmount(105);
            const embed = createEmbed(`${user.username}`, `__${amount}%__ 変態!!`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'howmarry') {
            const amount = getRandomAmount(100);
            const embed = createEmbed(`${user.username}`, `__${amount}%__ 結婚できます!!`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'facerank') {
            const arr = [
                `イケメン ←${user.username}\n上上\n上中\n上下\n中上\n中中\n中下\n下上\n下中\n下下\nブサイク`,
                `イケメン\n上上 ←${user.username}\n上中\n上下\n中上\n中中\n中下\n下上\n下中\n下下\nブサイク`,
                `イケメン\n上上\n上中 ←${user.username}\n上下\n中上\n中中\n中下\n下上\n下中\n下下\nブサイク`,
                `イケメン\n上上\n上中\n上下 ←${user.username}\n中上\n中中\n中下\n下上\n下中\n下下\nブサイク`,
                `イケメン\n上上\n上中\n上下\n中上 ←${user.username}\n中中\n中下\n下上\n下中\n下下\nブサイク`,
                `イケメン\n上上\n上中\n上下\n中上\n中中 ←${user.username}\n中下\n下上\n下中\n下下\nブサイク`,
                `イケメン\n上上\n上中\n上下\n中上\n中中\n中下 ←${user.username}\n下上\n下中\n下下\nブサイク`,
                `イケメン\n上上\n上中\n上下\n中上\n中中\n中下\n下上 ←${user.username}\n下中\n下下\nブサイク`,
                `イケメン\n上上\n上中\n上下\n中上\n中中\n中下\n下上\n下中 ←${user.username}\n下下\nブサイク`,
                `イケメン\n上上\n上中\n上下\n中上\n中中\n中下\n下上\n下中\n下下 ←${user.username}\nブサイク`,
                `イケメン\n上上\n上中\n上下\n中上\n中中\n中下\n下上\n下中\n下下\nブサイク ←${user.username}`,
            ];
            const random = getRandomAmount(arr.length - 1);
            const result = arr[random];
            const embed = createEmbed(`${user.username }`, `顔面ランク\n〜〜〜〜〜〜〜〜〜\n${result}\n〜〜〜〜〜〜〜〜〜`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'bodyprice') {
            const amounts = Array.from({ length: 6 }, () => getRandomAmount(100000));
            const embed = createEmbed(`${user.username}`, `${user.username}の体の値段🥩\n【頭　部】${amounts[0]}円\n【胸　部】${amounts[1]}円\n【　腕　】${amounts[2]}円\n【　腰　】${amounts[3]}円\n【股　関】${amounts[4]}円\n【　脚　】${amounts[5]}円`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'headscrew') {
            const amount = getRandomAmount(100);
            const embed = createEmbed(`${user.username}`, `${user.username}の頭ネジぶっ飛び度 \n __${amount}%__`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'girlrate') {
            const amount = getRandomAmount(100);
            const embed = createEmbed(`${user.username}`, `${user.username}の女の子度 \n __${amount}%__`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'brain') {
            const amount = getRandomAmount(9);
            const randomMessages = [
                "オーク",
                "🐦の脳",
                "原子1個分の脳",
                "ひよこ",
                "IQ 30",
                "💩",
                "炭酸水",
                "ポッポ",
                "3歳",
                "5歳",
            ];
            const embed = createEmbed(`${user.username}`, `${user.username}の脳みそ ${randomMessages[amount]}`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'height-weight') {
            const height = getRandomAmount(210, 120);
            const weight = getRandomAmount(120, 40);
            const embed = createEmbed(`${user.username}`, `${user.username}の身長・体重は\n__${height}__cm・__${weight}__kgです。`);
            i.reply({ embeds: [embed] });
        }

        if (type === 'friends') {
            const amount = getRandomAmount(50);
            const embed = createEmbed(`${user.username}`, `${user.username}の親友は__${amount}人__です`);
            i.reply({ embeds: [embed] });
        }
    },
};

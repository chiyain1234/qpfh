const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const bigInt = require('big-integer');

const cmdName = "uidprime";

// ニュートン法を使った平方根の計算
const sqrt = value => {
    let x = value;
    let y = bigInt.one;
    const e = bigInt(10).pow(10); // 精度の設定
    while (x.subtract(y).abs().greater(e)) {
        x = x.add(y).divide(2);
        y = value.divide(x);
    }
    return x;
};

const primeFactorization = number => {
    let n = bigInt(number);
    if (n.leq(1)) return null;

    const result = [];

    let count = 0;
    // 2で割る
    while (n.mod(2).equals(0)) {
        ++count;
        n = n.divide(2);
    }
    if (count > 0) result.push({ number: 2, count: count });

    // 奇数で割る
    let max = sqrt(n);
    for (let i = bigInt(3); i.leq(max); i = i.add(2)) {
        if (n.mod(i).equals(0)) {
            count = 0;
            do {
                ++count;
                n = n.divide(i);
            } while (n.mod(i).equals(0));
            result.push({ number: i.toString(), count: count });
            max = sqrt(n);
        }
    }
    if (!n.equals(1)) result.push({ number: n.toString(), count: 1 });
    return result;
};

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定したユーザーのユーザーIDの下4桁を素因数分解する。')
        .addUserOption(option => option
            .setName('user')
            .setDescription('ユーザーを選択してください。')
            .setRequired(false)
        ),

    async execute(i, client) {
        await i.deferReply();
        const user = i.options.getUser('user') || i.user;
        const userId = user.id;
        const last4Digits = userId.slice(-4);
        const prime = primeFactorization(last4Digits);

        let length = userId.length;

        let formattedNumber;
        if (length <= 4) {
            formattedNumber = `__${userId}__`;
        } else {
            let mainPart = userId.slice(0, length - 4);
            let lastFourDigits = userId.slice(length - 4);
            formattedNumber = `${mainPart}(${lastFourDigits})`;
        }
        const expression = generateExpression(prime);
        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`数値: ${formattedNumber}`)
            .setDescription(`結果: ${expression}`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });
        return i.editReply({ embeds: [Embed] });
    }
};

function generateExpression(prime) {
    return prime.map(item => {
        if (item.count === 1) {
            return `${item.number}`;
        } else {
            return `${item.number}^${item.count}`;
        }
    }).join(' × ');
}
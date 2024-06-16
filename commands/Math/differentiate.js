const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const cmdName = "differentiate";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("指定した関数の導関数を求める。")
        .addStringOption(option => option.setName('function')
            .setDescription('関数を入力してください。(例: 2x+1)')
            .setRequired(true))
        .addStringOption(option => option.setName('variable')
            .setDescription('変数を入力してください。')
            .setRequired(true)),

    async execute(i, client) {
        const cal = i.options.getString('function');
        const x = i.options.getString('variable');
        const mat = cal.replace(/×/g, "*").replace(/÷/g, "/").replace(/√/g, "sqrt").replace(/,/g, ".").replace(/π/g, "pi").replace(/°/g, "deg");

        try {
            const result = math.derivative(mat, x).toString();
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .addField("**被微分関数**", `\`\`\`Js\nf(${x}) = ${cal}\`\`\``)
                .addField("**導関数**", `\`\`\`Js\nd/d${x} f(${x}) = ${result}\`\`\``)
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });
            await i.reply({ embeds: [embed] });
        } catch (e) {
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle("エラー")
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    "**有効な値を入力してください。**\n\n" +
                    "**計算の例** - \n" +
                    "1. **平方根の計算** - `sqrt(3^2 + 4^2) = 5`\n" +
                    "2. **単位の変換** - `2 inch to cm = 0.58`\n" +
                    "3. **三角関数** - `cos(45 deg) = 0.7071067811865476`\n" +
                    "4. **通常の計算** - `+, -, ^, /, 少数` = `2.5 - 2 = 0.5`\n" +
                    "5. **累乗の計算** - `2^3 = 8`"
                )
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });
            await i.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
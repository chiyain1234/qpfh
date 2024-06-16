const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

const cmdName = "log";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("対数を計算します。")
        .addNumberOption(option => option.setName('base')
            .setDescription('対数の底を入力してください。')
            .setRequired(true))
        .addNumberOption(option => option.setName('value')
            .setDescription('対数を取る値を入力してください。')
            .setRequired(true)),

    async execute(interaction, client) {
        const base = interaction.options.getNumber('base');
        const value = interaction.options.getNumber('value');
        const mat = String(base).replace(/0/g, "₀").replace(/1/g, "₁").replace(/2/g, "₂").replace(/3/g, "₃").replace(/4/g, "₄").replace(/5/g, "₅").replace(/6/g, "₆").replace(/7/g, "₇").replace(/8/g, "₈").replace(/9/g, "₉")
        try {
            const result = math.log(value, base);
            const embed = new MessageEmbed()
            .setColor(client.config.color)
                .setTitle('対数の計算結果')
                .setDescription(`底: ${base}, 真数: ${value}`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                .addFields(
                    { name: "**対数**", value: `\`\`\`Js\nlog${mat}${value}\`\`\`` },
                    { name: "**結果**", value: `\`\`\`Js\n${result}\`\`\`` }
                )
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply('対数の計算中にエラーが発生しました。正しい値を入力してください。');
        }
    },
};

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

const cmdName = "det";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("行列式を計算します。")
        .addStringOption(option => option.setName('matrix')
            .setDescription('行列式を入力してください。')
            .setRequired(true)),

    async execute(interaction, client) {
        const matrixStr = interaction.options.getString('matrix');
        const mat = matrixStr.replace(/;/g, "\n");

        try {
            const result = math.evaluate(`det(${matrixStr})`);
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                .addFields(
                    { name: "**行列式**", value: `\`\`\`Js\n${mat}\`\`\`` },
                    { name: "**結果**", value: `\`\`\`Js\n${result}\`\`\`` }
                )
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle("エラー")
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                .setDescription(
                    "**有効な行列式を入力してください。**\n\n" +
                    "行列式の例:\n" +
                    "`[[1, 2 ; 3, 4]]`\n"
                )
                .setTimestamp()
                .setFooter({ text: `/${cmdName}` });

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};

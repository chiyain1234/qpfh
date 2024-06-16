const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('convert_time')
        .setDescription('時間の単位変換を行います。')
        .addNumberOption(option =>
            option.setName('quantity')
                  .setDescription('変換する数量を入力してください。')
                  .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('from')
                  .setDescription('変換元の単位を選択してください。')
                  .setRequired(true)
                  .addChoices([
                      { name: 'second', value: 's' },
                      { name: 'minute', value: 'min' },
                      { name: 'hour', value: 'h' },
                      { name: 'day', value: 'day' },
                      { name: 'week', value: 'week' },
                      { name: 'month', value: 'month' },
                      { name: 'year', value: 'year' },
                      { name: 'decade', value: 'decade' },
                      { name: 'century', value: 'century' },
                      { name: 'millennium', value: 'millennium' }
                  ])
        )
        .addStringOption(option =>
            option.setName('to')
                  .setDescription('変換後の単位を選択してください。')
                  .setRequired(true)
                  .addChoices([
                    { name: 'second', value: 's' },
                    { name: 'minute', value: 'min' },
                    { name: 'hour', value: 'h' },
                    { name: 'day', value: 'day' },
                    { name: 'week', value: 'week' },
                    { name: 'month', value: 'month' },
                    { name: 'year', value: 'year' },
                    { name: 'decade', value: 'decade' },
                    { name: 'century', value: 'century' },
                    { name: 'millennium', value: 'millennium' }
                  ])
        ),

    async execute(interaction, client) {
        const quantity = interaction.options.getNumber('quantity');
        const fromUnit = interaction.options.getString('from');
        const toUnit = interaction.options.getString('to');

        await interaction.deferReply();

        try {
            const result = math.evaluate(`${quantity} ${fromUnit} to ${toUnit}`);
            
            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('時間の単位変換結果')
                .setDescription(`\`\`\`\n${quantity} ${fromUnit}\n\`\`\`\n\`\`\`\n${result}\n\`\`\``)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp()
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            
            await interaction.editReply({ embeds: [Embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('単位変換中にエラーが発生しました。');
        }
    }
};

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('convert_volume')
        .setDescription('体積の単位変換を行います。')
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
                      { name: 'mm3', value: 'mm3' },
                      { name: 'cm3', value: 'cm3' },
                      { name: 'cubic meter', value: 'm3' },
                      { name: 'km3', value: 'km3' },
                      { name: 'litre', value: 'l' },
                      { name: 'litre', value: 'L' },
                      { name: 'litre', value: 'lt' },
                      { name: 'liter', value: 'liter' },
                      { name: 'cubic centimeter', value: 'cc' },
                      { name: 'cubic inch', value: 'cuin' },
                      { name: 'cubic foot', value: 'cuft' },
                      { name: 'cubic yard', value: 'cuyd' },
                      { name: 'teaspoon', value: 'tsp' },
                      { name: 'tablespoon', value: 'tbsp' }
                  ])
        )
        .addStringOption(option =>
            option.setName('to')
                  .setDescription('変換後の単位を選択してください。')
                  .setRequired(true)
                  .addChoices([
                      { name: 'cubic meter', value: 'm3' },
                      { name: 'litre', value: 'l' },
                      { name: 'litre', value: 'L' },
                      { name: 'litre', value: 'lt' },
                      { name: 'liter', value: 'liter' },
                      { name: 'cubic centimeter', value: 'cc' },
                      { name: 'cubic inch', value: 'cuin' },
                      { name: 'cubic foot', value: 'cuft' },
                      { name: 'cubic yard', value: 'cuyd' },
                      { name: 'teaspoon', value: 'tsp' },
                      { name: 'tablespoon', value: 'tbsp' }
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
                .setTitle('体積の単位変換結果')
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

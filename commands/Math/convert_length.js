const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('convert_length')
        .setDescription('単位変換を行います。')
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
                      { name: 'mm', value: 'mm' },
                      { name: 'cm', value: 'cm' },
                      { name: 'm', value: 'm' },
                      { name: 'km', value: 'km' },
                      { name: 'inch', value: 'in' },
                      { name: 'foot', value: 'ft' },
                      { name: 'yard', value: 'yd' },
                      { name: 'mile', value: 'mi' },
                      { name: 'link', value: 'li' },
                      { name: 'rod', value: 'rd' },
                      { name: 'chain', value: 'ch' },
                      { name: 'angstrom', value: 'angstrom' },
                      { name: 'mil', value: 'mil' }
                  ])
        )
        .addStringOption(option =>
            option.setName('to')
                  .setDescription('変換後の単位を選択してください。')
                  .setRequired(true)
                  .addChoices([
                    { name: 'mm', value: 'mm' },
                    { name: 'cm', value: 'cm' },
                    { name: 'm', value: 'm' },
                    { name: 'km', value: 'km' },
                    { name: 'inch', value: 'in' },
                    { name: 'foot', value: 'ft' },
                    { name: 'yard', value: 'yd' },
                    { name: 'mile', value: 'mi' },
                    { name: 'link', value: 'li' },
                    { name: 'rod', value: 'rd' },
                    { name: 'chain', value: 'ch' },
                    { name: 'angstrom', value: 'angstrom' },
                    { name: 'mil', value: 'mil' }
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
                .setTitle('単位変換結果')
                .setDescription(`\`\`\`\n${quantity} ${fromUnit}\n\`\`\`\n\`\`\`\n${result}\n\`\`\``)
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString(), iconURL: '' });
            
            await interaction.editReply({ embeds: [Embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('単位変換中にエラーが発生しました。');
        }
    }
};

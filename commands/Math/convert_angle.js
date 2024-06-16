const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('convert_angle')
        .setDescription('角度の単位変換を行います。')
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
                      { name: 'radian', value: 'rad' },
                      { name: 'degree', value: 'deg' },
                      { name: 'gradian', value: 'grad' },
                      { name: 'cycle', value: 'cycle' },
                      { name: 'arcsecond', value: 'arcsec' },
                      { name: 'arcminute', value: 'arcmin' }
                  ])
        )
        .addStringOption(option =>
            option.setName('to')
                  .setDescription('変換後の単位を選択してください。')
                  .setRequired(true)
                  .addChoices([
                      { name: 'radian', value: 'rad' },
                      { name: 'degree', value: 'deg' },
                      { name: 'gradian', value: 'grad' },
                      { name: 'cycle', value: 'cycle' },
                      { name: 'arcsecond', value: 'arcsec' },
                      { name: 'arcminute', value: 'arcmin' }
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
                .setTitle('角度の単位変換結果')
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

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('randomnumber')
        .setDescription('指定された範囲で乱数を生成します')
        .addIntegerOption(option => 
            option.setName('min')
                .setDescription('最小値')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('max')
                .setDescription('最大値')
                .setRequired(true)),

    async execute(interaction, client) {
        const min = interaction.options.getInteger('min');
        const max = interaction.options.getInteger('max');
        
        if (min >= max) {
            await interaction.reply('最大値は最小値より大きくなければなりません。');
            return;
        }

        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        const embed = new MessageEmbed()
            .setTitle('乱数生成')
            .setDescription(`生成された乱数: **${randomNumber}**`)
            .setColor(client.config.color)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.reply({ embeds: [embed] });
    }
};
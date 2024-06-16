const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('randomstring')
        .setDescription('指定された文字数でランダムな英数字を生成します')
        .addIntegerOption(option => 
            option.setName('length')
                .setDescription('生成する文字数')
                .setRequired(false)),

    async execute(interaction, client) {
        const defaultLength = Math.floor(Math.random() * 10) + 1;
        const length = interaction.options.getInteger('length') || defaultLength;

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }

        const embed = new MessageEmbed()
            .setTitle('ランダム英数字生成')
            .setDescription(`生成された英数字: **${randomString}**`)
            .setColor(client.config.color)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.reply({ embeds: [embed] });
    }
};

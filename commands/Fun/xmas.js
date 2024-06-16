const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('xmas')
        .setDescription('クリスマスまでの残り日数を表示します。'),

    async execute(i, client) {
        await i.deferReply();

        const today = new Date();
        const xmas = new Date(today.getFullYear(), 11, 25);
        if (today.getMonth() === 11 && today.getDate() > 25) {
            xmas.setFullYear(xmas.getFullYear() + 1);
        }

        const oneDay = 1000 * 60 * 60 * 24;
        const daysLeft = Math.ceil((xmas.getTime() - today.getTime()) / oneDay);

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle('クリスマスまでの残り日数')
            .setDescription(`**${daysLeft} 日**`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });

        await i.editReply({ embeds: [embed] });
    },
};

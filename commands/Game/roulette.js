const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('roulette')
        .setDescription('ルーレットを回します')
        .addStringOption(option => 
            option.setName('choices')
                .setDescription('ルーレットの選択肢（カンマで区切る）')
                .setRequired(true)),

    async execute(interaction, client ) {
        const choices = interaction.options.getString('choices').split(',');
        const choice = choices[Math.floor(Math.random() * choices.length)];

        const embed = new MessageEmbed()
            .setTitle('ルーレット結果')
            .setDescription(`**${choice}**`)
            .setColor(client.config.color)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.reply({ embeds: [embed] });
    }
};

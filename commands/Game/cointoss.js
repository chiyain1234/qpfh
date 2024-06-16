const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('cointoss')
        .setDescription('コイントスをします')
        .addStringOption(option => 
            option.setName('choice')
            .setDescription('表か裏を選んでください')
            .setRequired(true)
            .addChoices(
                { name: '表', value: 'heads' },
                { name: '裏', value: 'tails' }
            )),

    async execute(interaction, client) {
        const userChoice = interaction.options.getString('choice');
        const coin = Math.random() < 0.5 ? 'heads' : 'tails';
        const result = userChoice === coin ? 'おめでとうございます！当たりです！' : '残念！外れです。';

        const embed = new MessageEmbed()
            .setTitle('コイントス')
            .setDescription(`結果は **${coin === 'heads' ? '表' : '裏'}** でした。${result}`)
            .setColor(client.config.color)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.reply({ embeds: [embed] });
    }
};

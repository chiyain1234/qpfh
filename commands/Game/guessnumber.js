const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('guessnumber')
        .setDescription('数字当てゲームをします')
        .addIntegerOption(option => 
            option.setName('number')
            .setDescription('1から100までの数字を入力してください')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)),

    async execute(interaction, client) {
        const userGuess = interaction.options.getInteger('number');
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let result;

        if (userGuess === randomNumber) {
            result = "おめでとうございます！当たりです！";
        } else if (userGuess > randomNumber) {
            result = `残念！正解は ${randomNumber} です。少し高すぎました。`;
        } else {
            result = `残念！正解は ${randomNumber} です。少し低すぎました。`;
        }

        const embed = new MessageEmbed()
            .setTitle('数字当てゲーム')
            .setDescription(result)
            .setColor(client.config.color)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });
        await interaction.reply({ embeds: [embed] });
    }
};

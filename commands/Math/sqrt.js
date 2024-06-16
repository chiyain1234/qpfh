const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('sqrt')
        .setDescription('与えられた数値の平方根を計算します。')
        .addNumberOption(option => 
            option.setName('number')
                  .setDescription('平方根を計算する数値を入力してください。')
                  .setRequired(true)
        ),

    async execute(i, client) {
        const number = i.options.getNumber('number');
        await i.deferReply();

        const result = math.sqrt(number)

        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`数値: ${number}`)
            .setDescription(`結果: ${result}`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });
        await i.editReply({ embeds: [Embed] });
    }
};

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const { pi } = require('mathjs');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('pi')
        .setDescription('円周率πを表示します。')
        .addIntegerOption(option => 
            option.setName('number')
                  .setDescription('表示する桁数を入力してください。')
                  .setRequired(true)
                  .setMaxValue(15)
                  .setMinValue(0)
        ),

    async execute(i, client) {
        const number = i.options.getInteger('number');
        await i.deferReply();

        if (number < 0) {
            await i.reply('負の数の平方根は計算できません。');
            return;
        }
        const result = math.round(pi, number)

        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`円周率π`)
            .setDescription(`\n\`\`\`\n${result}\n\`\`\`\n`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });
        return i.editReply({ embeds: [Embed] });
    }
};

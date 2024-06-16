const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const ojichat = require('ojichat.js')
const cmdName = "ojisan"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("おじさん構文を生成する。")
        .addStringOption(option => option.setName('name')
            .setDescription('名前を入力してください。')
            .setRequired(false))
        .addNumberOption(
            option => option
            .setName("emoji")
            .setDescription("絵文字の度合い 0~9")
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(9)
        ),


    async execute(i, client) {
        if (i.options.getString('name') === null) {
            if (i.options.getNumber('emoji') === null) {
                var text = new ojichat.Generator().getMessage()
            } else {
                var number = i.options.getNumber('emoji')
                var text = new ojichat.Generator(number).getMessage()
            }
        } else {
            if (i.options.getNumber('emoji') === null) {
                var name = i.options.getString('name');
                var text = new ojichat.Generator(name).getMessage()
            } else {
                var name = i.options.getString('name');
                var number = i.options.getNumber('emoji')
                var text = new ojichat.Generator(name, number).getMessage()
            }
        }

        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setDescription(`${text}`)
            .setTimestamp()
            .setFooter({ text: `/${cmdName}`, iconURL: '' });

       await i.reply({ embeds: [Embed] });


    }
}
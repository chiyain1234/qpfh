const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const { menheraText } = require('../../functions.js');
const cmdName = "menhera"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("メンヘラ文章を生成する。")
        .addStringOption(option => option.setName('text')
            .setDescription('文章を入力してください。')
            .setRequired(true)),


    async execute(i, client) {
        const text = i.options.getString('text')
        const menhera = menheraText(text)
        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setDescription(`${menhera}`)
            .setTimestamp()
            .setFooter({ text: `/${cmdName}`, iconURL: '' });

        await i.reply({ embeds: [Embed] });


    }
}
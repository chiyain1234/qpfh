const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageAttachment } = require("discord.js")

const cmdName = "randomavatar"
const { Permissions } = require('discord.js');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('ボットが確認できるユーザーの中からランダムにアバターを取得する。'),

    async execute(i, client) {
        try {
            var user = client.users.cache.random()

            var avatar = user.displayAvatarURL({ size: 4096, format: 'png' })
            var title = `${user.tag}'s Avatar`

            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(title)
                .setURL(`${avatar}`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setImage('attachment://useravatar.png')
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });

            await i.deferReply();

            let attachment = new MessageAttachment(avatar, "useravatar.png");

            return i.editReply({ embeds: [Embed], files: [attachment] })

        } catch {

            const nobanner = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle("ユーザーのアバターが取得出来ませんでした。")
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });

            return i.reply({ embeds: [nobanner], ephemeral: true })
        }
    }
}
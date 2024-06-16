const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const axios = require('axios')

const cmdName = "qrcode"
var validUrl = require('valid-url');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("URLをQRコードにする。")
        .addStringOption(option => option.setName('url')
            .setDescription('URLを入力してください。')
            .setRequired(true)),

    async execute(i, client) {
        var url = i.options.getString('url')
        await i.deferReply();
        if (validUrl.isUri(url)) {
            const uri = `https://api.qrserver.com/v1/create-qr-code/?size=4096x4096&data=${url}`
            var image = encodeURI(uri);

            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`QRコードを生成しました。`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setDescription(`URL:\n${url}`)
                .setImage("attachment://qrcode.png")
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            let attachment = new MessageAttachment(image, "qrcode.png");
            await i.editReply({ embeds: [Embed], files: [attachment] })
        } else {
            const Deembed = new MessageEmbed()
                .setTitle("エラー")
                .setDescription(`これはURLでありません。`)
                .setColor("RED");
            await i.editReply({ embeds: [Deembed], ephemeral: true })
        }


    }
}
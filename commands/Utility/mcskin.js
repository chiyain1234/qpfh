const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require('discord.js');

const cmdName = "mcskin"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("マインクラフトのスキンの画像を取得する。")
        .addStringOption(option => option.setName('text')
            .setDescription('検索ワードを入力してください。')
            .setRequired(true)),
    async execute(i, client) {

        var text = i.options.getString('text')
        await i.deferReply();
        const image = `https://minotar.net/armor/body/${text}/2048.png`
        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`Minecraftスキン `)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .addFields({ name: "ユーザー名", value: text })
            .setImage("attachment://mcskin.png")
            .setThumbnail(`https://minotar.net/helm/${text}/2048.png`)
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });
        let attachment = new MessageAttachment(image, "mcskin.png");
        await i.editReply({ embeds: [Embed], files: [attachment] })
    }
}
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageAttachment } = require("discord.js")
const cmdName = "servericon"

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('サーバーのアイコン画像を取得する。'),

    async execute(i, client) {
        await i.deferReply();
        try {
            const image = i.guild.iconURL({ dynamic: true, size: 2048 })
            const attachment = new MessageAttachment(image, "servericon.png");
            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(i.guild.name)
                .setURL(`${image}`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setImage('attachment://servericon.png')
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            return i.editReply({ embeds: [Embed], files: [attachment] });
        } catch (err) {
            await i.editReply("画像の取得ができませんでした。");
        }
    }
}
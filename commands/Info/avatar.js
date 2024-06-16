const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageAttachment } = require("discord.js")
const cmdName = "avatar"

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定したユーザーのアバターを取得する。')
        .addUserOption(option => option
            .setName('user')
            .setDescription('ユーザーを選択してください。')
            .setRequired(false)
        ),

    async execute(i, client) {
        await i.deferReply();
        try {
            const user = i.options.getMember('user') || i.user
            const avatar = user.displayAvatarURL({ dynamic: true, size: 2048 })
            const title = `${user.tag}'s Avatar`

            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(title)
                .setURL(`${avatar}`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setImage('attachment://useravatar.png')
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            let attachment = new MessageAttachment(avatar, "useravatar.png");
            return i.editReply({ embeds: [Embed], files: [attachment] });
        } catch (err) {
            await i.editReply("アバターの取得ができませんでした。");
        }
    }
}
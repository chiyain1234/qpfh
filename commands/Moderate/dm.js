const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "ADMINISTRATOR",
    data: new SlashCommandSubcommandBuilder()
        .setName('dm')
        .setDescription('指定した人にダイレクトメッセージを送る。')
        .addUserOption((option) => {
            return option
                .setName('user')
                .setDescription('ユーザーを選択してください。')
                .setRequired(true)
        })
        .addStringOption(option => option.setName('text')
            .setDescription('テキストを入力してください。')
            .setRequired(true)),

    async execute(i, client) {
        const user = i.options.getUser('user')
        const text = i.options.getString('text')

        try {
            const embeds = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTitle(`${i.user.tag}からのダイレクトメッセージ`)
                .setDescription(text)
                .setTimestamp()
            await user.send({ embeds: [embeds] })

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTitle(`${user.tag} にダイレクトメッセージを送信しました。`)
                .setDescription(text)
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            i.reply({ embeds: [embed], ephemeral: true });
        } catch {
            return i.reply({ content: `メッセージの送信に失敗しました。\n相手がDMの受信をできないようにしている可能性があります。`, ephemeral: true });
        }
    }
}
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageAttachment } = require("discord.js")
const cmdName = "banner"

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定したユーザーのバナーを取得する。')
        .addUserOption(option => option
            .setName('user')
            .setDescription('ユーザーを選択してください。')
            .setRequired(false)
        ),

    async execute(i, client) {
        await i.deferReply();
            const member = i.options.getMember('user') || i.member;
            const user = await member.user.fetch();
            const banner = user.bannerURL({ dynamic: true, size: 4096 })
        if(banner) {
            const title = `${user.tag}'s Banner`
            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(title)
                .setURL(`${banner}`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setImage('attachment://banner.png')
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            let attachment = new MessageAttachment(banner, "banner.png");
            return i.editReply({ embeds: [Embed], files: [attachment] });
        } else {
            await i.editReply("バナーの取得ができませんでした。");
        }
    }
}
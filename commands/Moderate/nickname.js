const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const cmdName = "edit_nickname";

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "MANAGE_NICKNAMES",
    botPerm: "MANAGE_NICKNAMES",
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定したユーザーのニックネームを変更します。')
        .addUserOption((option) => {
            return option
                .setName('user')
                .setDescription('ユーザーを選択してください。')
                .setRequired(true);
        })
        .addStringOption((option) => {
            return option
                .setName('nickname')
                .setDescription('新しいニックネームを入力してください。')
                .setRequired(true);
        }),

    async execute(i, client) {
        try {
            const member = i.options.getMember('user');
            const newNickname = i.options.getString('nickname');
            await member.setNickname(newNickname);

            const embed = new MessageEmbed()
                .setTitle('ニックネームを変更しました。')
                .setDescription(`完了: ${member} のニックネームを\n「${newNickname}」に変更しました。`)
                .setColor(client.config.color)
                .setTimestamp()
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: `/${cmdName}`, iconURL: '' });

            return i.reply({ embeds: [embed] });
        } catch (error) {
            console.error("ニックネーム変更中にエラーが発生しました:", error);
            return i.reply({
                content: `ニックネームの変更に失敗しました。\nボットに**ニックネームの管理**の権限がない可能性があります。\n・ユーザーがボットの上にある可能性があります。`,
                ephemeral: true
            });
        }
    }
};

const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const cmdName = "removerole";

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "MANAGE_ROLES",
    botPerm: "MANAGE_ROLES",
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定した人から指定したロールを外す。')
        .addUserOption((option) => {
            return option
                .setName('user')
                .setDescription('ユーザーを選択してください。')
                .setRequired(true);
        })
        .addRoleOption((option) => {
            return option
                .setName('role')
                .setDescription('ロールを選択してください。')
                .setRequired(true);
        }),

    async execute(i, client) {
        try {
            const member = i.options.getMember('user');
            const role = i.options.getRole('role');
            await member.roles.remove(role.id);

            const embed = new MessageEmbed()
                .setTitle('ロールを削除しました。')
                .setDescription(`完了: ${member} から\n${role}を削除しました。`)
                .setColor(client.config.color)
                .setTimestamp()
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: `/${cmdName}`, iconURL: '' });

            return i.reply({ embeds: [embed] });
        } catch (error) {
            console.error("ロール削除中にエラーが発生しました:", error);
            return i.reply({
                content: `ロールの削除に失敗しました。\nボットに**ロールの管理**の権限がない可能性があります。\n・ロールがボットの上にある可能性があります。`,
                ephemeral: true
            });
        }
    }
};

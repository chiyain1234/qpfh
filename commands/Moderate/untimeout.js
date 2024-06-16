const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "MODERATE_MEMBERS",
    botPerm: "MODERATE_MEMBERS",
    data: new SlashCommandSubcommandBuilder()
        .setName("untimeout")
        .setDescription("指定したユーザーのタイムアウトを解除します。")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("タイムアウトを解除するユーザーを選択してください。")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const user = interaction.options.getUser("user");
        const member = interaction.guild.members.cache.get(user.id);

        try {
            await member.timeout(null);
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setDescription(`${user.tag} のタイムアウトが解除されました。`)
                .setTimestamp()
                .setFooter({ text: interaction.toString(), iconURL: '' })
                .setThumbnail(user.displayAvatarURL());

            await interaction.reply({ content: member.toString(), embeds: [embed], ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: "タイムアウト解除中にエラーが発生しました。", ephemeral: true });
        }
    }
};

const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "BAN_MEMBERS",
    botPerm: "BAN_MEMBERS",
    data: new SlashCommandSubcommandBuilder()
        .setName("unban")
        .setDescription("指定したユーザーのBANを解除します。")
        .addStringOption(option =>
            option.setName("userid")
                .setDescription("BANを解除するユーザーのIDを指定してください。")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const userId = interaction.options.getString("userid");

        try {
            const user = await client.users.fetch(userId);
            await interaction.guild.bans.remove(userId);
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setDescription(`${user.tag} のBANが解除されました。`)
                .setTimestamp()
                .setFooter({ text: interaction.toString(), iconURL: '' })
                .setThumbnail(user.displayAvatarURL());
            await interaction.reply({ content: user.toString(), embeds: [embed] });
        } catch (error) {
            await interaction.reply("BAN解除中にエラーが発生しました。");
        }
    }
};

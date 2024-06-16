const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "KICK_MEMBERS",
    botPerm: "KICK_MEMBERS",
    data: new SlashCommandSubcommandBuilder()
        .setName("kick")
        .setDescription("指定したユーザーをキックします。")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("キックするユーザーを指定してください。")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("キックの理由を入力してください。")
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const reason = interaction.options.getString("reason") || "None";
        const member = interaction.options.getMember("user");

        try {
            await member.kick(reason);
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setDescription(`${member.user.tag} がキックされました。`)
                .setTimestamp()
                .setFooter({ text: interaction.toString(), iconURL: '' })
                .setThumbnail(member.user.displayAvatarURL());
            await interaction.reply({content: member.toString(), embeds: [embed] });
        } catch (error) {
            await interaction.reply("キック中にエラーが発生しました。");
        }
    }
};

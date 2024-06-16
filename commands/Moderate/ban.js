const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "BAN_MEMBERS",
    botPerm: "BAN_MEMBERS",
    data: new SlashCommandSubcommandBuilder()
        .setName("ban")
        .setDescription("指定したユーザーをBANします。")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("BANするユーザーを指定してください。")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("BANの理由を入力してください。")
                .setRequired(false)
        )		
        .addStringOption(option => option
                         .setName('message')
                         .setDescription('メッセージ履歴の削除期間を選択')
                         .addChoices(
                          { name: '削除しない', value: '0'},
                          { name: '過去24時間', value: '1'},
                          { name: '過去7日', value:'7'})
                         .setRequired(false)),
	

    async execute(interaction, client) {
        const reasons = interaction.options.getString("reason") || "None"
        const member = interaction.options.getMember("user");
        const message = interaction.options.getString("message") || "0"

        try {
            await member.ban({days:message, reason:reasons});
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setDescription(`${member.user.tag} がBANされました。`)
                .setTimestamp()
                .setFooter({ text: interaction.toString(), iconURL: '' })
                .setThumbnail(member.user.displayAvatarURL());
            await interaction.reply({ content: member.toString(), embeds: [embed] });
        } catch (error) {
            console.error("BAN中にエラーが発生しました:", error);
            await interaction.reply("BAN中にエラーが発生しました。");
        }
    }
};

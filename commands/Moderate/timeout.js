const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "MODERATE_MEMBERS",
    botPerm: "MODERATE_MEMBERS",
    data: new SlashCommandSubcommandBuilder()
        .setName("timeout")
        .setDescription("指定したユーザーを一時的にタイムアウトさせます。")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("タイムアウトさせるユーザーを選択してください。")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("duration")
                .setDescription("タイムアウトの長さを入力してください。(e.g. 10 minutes)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("タイムアウトの理由を入力してください。")
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const user = interaction.options.getUser("user");
        const member = interaction.guild.members.cache.get(user.id);
        const reason = interaction.options.getString("reason") || "";
        const duration = interaction.options.getString("duration");
        const timeInMs = ms(duration);

        if (!timeInMs || timeInMs < 1000 || timeInMs > 28 * 24 * 60 * 60 * 1000) {
            await interaction.reply({ content: "有効なタイムアウトの期間を入力してください。", ephemeral: true });
            return;
        }

        try {
            await member.timeout(timeInMs, reason);

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setDescription(`${member.user.tag} がタイムアウトされました。`)
                .setTimestamp()
                .setFooter({ text: interaction.toString(), iconURL: '' })
                .setThumbnail(member.user.displayAvatarURL())
                .addFields({name: "期間", value: duration, inlien: true})
                .addFields({name: "理由", value: reason || "なし", inline: false});
            await interaction.reply({ content: member.toString(), embeds: [embed], ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: "タイムアウト中にエラーが発生しました。", ephemeral: true });
        }
    }
};

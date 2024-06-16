const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName("banlist")
        .setDescription("BANされたユーザーのリストを表示します。"),

    async execute(interaction, client) {
        try {
            const bans = await interaction.guild.bans.fetch();
            const banList = bans.map(ban => ban.user.username).slice(0, 10); // 最大10人まで表示

            if (banList.length === 0) {
                await interaction.reply({ content: "BANされたユーザーはいません。", ephemeral: true });
                return;
            }

            const embed = new MessageEmbed()
                .setTitle("BANされたユーザーリスト")
                .setDescription(banList.join("\n"))
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString(), iconURL: '' });

            await interaction.reply({ embeds: [embed]});
        } catch (error) {
            console.error("BANリストの取得中にエラーが発生しました:", error);
            await interaction.reply({ content: "BANリストの取得中にエラーが発生しました。", ephemeral: true });
        }
    }
};

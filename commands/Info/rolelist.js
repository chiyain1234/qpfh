const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('rolelist')
        .setDescription('サーバー内の全ロールを一覧表示する。'),

    async execute(interaction, client) {
        const guild = interaction.guild;

        const roles = guild.roles.cache
            .filter(role => role.name !== '@everyone') 
            .sort((a, b) => b.position - a.position)
            .map(role => role)
            .slice(0, 24);

        if (roles.length === 0) {
            await interaction.reply("このサーバーにはロールがありません。");
            return;
        }

        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(client.config.color)
            .setTitle('サーバーのロール一覧')
            .setFooter({ text: `/roles`, iconURL: '' })
            .setTimestamp();

        let description = roles.map((role, index) => {
            return `${index + 1}. ${role.toString()}: ${role.members.size} 人`;
        }).join('\n');

        embed.setDescription(description);

        await interaction.reply({ embeds: [embed] });
    }
};

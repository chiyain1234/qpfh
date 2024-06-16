const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('invites')
        .setDescription('サーバーのすべての招待リンクを取得する。'),

    async execute(interaction, client) {
        const guild = interaction.guild;

        const invites = await guild.invites.fetch();

        if (invites.size === 0) {
            await interaction.reply("このサーバーには招待リンクがありません。");
            return;
        }

        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(client.config.color)
            .setTitle('サーバーの招待リンク一覧')
            .setFooter({ text: `/invites`, iconURL: '' })
            .setTimestamp();

        let count = 0;
        invites.sort((a, b) => a.code.localeCompare(b.code)).forEach((invite, index) => {
          const expiresAt = `<t:${parseInt(invite.expiresAt / 1000)}:f>`  ? `<t:${parseInt(invite.expiresAt / 1000)}:f>` : '期限なし';
            if (count < 24) {
                const creator = invite.inviter; // 招待リンクの作成者
                embed.addFields({ name: `${count + 1}. ${invite.code}`, value: `${creator.username}\n有効期限: ${expiresAt}\n使用回数: ${invite.uses}`, inline: true });
            }
            count++;
        });

        await interaction.reply({ embeds: [embed] });
    }
};

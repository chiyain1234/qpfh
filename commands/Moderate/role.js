const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "MANAGE_ROLES",
    botPerm: "MANAGE_ROLES",
    data: new SlashCommandSubcommandBuilder()
        .setName('create_role')
        .setDescription('役職を作成する。')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('役職の名前を入力してください。')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('color')
                .setDescription('役職の色を入力してください。')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const name = interaction.options.getString('name');
        const color = interaction.options.getString('color') || null; // 色が指定されていない場合は null にする

        try {
            await interaction.guild.roles.create({
                name: name,
                color: color,
                reason: '新しい役職の作成',
            });

            await interaction.reply({
                content: `役職「${name}」が作成されました。`,
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
                content: "役職作成中にエラーが発生しました。",
                ephemeral: true
            });
        }
    }
};

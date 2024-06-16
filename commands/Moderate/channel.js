const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
module.exports = {
    guildOnly: true, 
    adminGuildOnly: false,
    userPerm: "MANAGE_CHANNELS",
    botPerm: "MANAGE_CHANNELS",
    data: new SlashCommandSubcommandBuilder() 
        .setName('create_channel')
        .setDescription('チャンネルを作成する。')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('名前を入力してください。')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('チャンネルの種類を選択してください。')
                .setRequired(true)
                .addChoices(
                    { name: 'テキスト', value: 'GUILD_TEXT' },
                    { name: 'ボイス', value: 'GUILD_VOICE' },
                    { name: 'カテゴリー', value: 'GUILD_CATEGORY' },
                )
        ),

    async execute(i, client) {
        const name = i.options.getString('name');
        const type = i.options.getString('type');

        try {
            await i.guild.channels.create(name, { type });

            await i.reply({
                content: `チャンネル「${name}」が作成されました。`, ephemeral: true
            });
        } catch (error) {
            await i.reply({
                content: "チャンネル作成中にエラーが発生しました。\nサーバーのコミュニティが無効になっています。", ephemeral: true
            });
        }
    }
};

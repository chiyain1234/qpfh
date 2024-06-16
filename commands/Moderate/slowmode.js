const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "MANAGE_CHANNELS",
    data: new SlashCommandSubcommandBuilder()
        .setName("setslowmode")
        .setDescription("指定したテキストチャンネルのスローモードを設定します。")
        .addIntegerOption(option =>
            option.setName("seconds")
                .setDescription("スローモードの秒数（最大21600秒/6時間）")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("スローモードを設定するチャンネルを選択してください。")
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const seconds = interaction.options.getInteger("seconds");
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        if (seconds < 0 || seconds > 21600) {
            await interaction.reply({ content: "スローモードの秒数は0から21600の間で指定してください。", ephemeral: true });
            return;
        }

        if (!channel.isText()) {
            await interaction.reply({ content: "このコマンドはテキストチャンネルでのみ使用できます。", ephemeral: true });
            return;
        }

        try {
            await channel.setRateLimitPerUser(seconds);
            await interaction.reply({ content: `チャンネル ${channel} のスローモードが${seconds}秒に設定されました。`, ephemeral: true });
        } catch (error) {
            console.error("スローモード設定中にエラーが発生しました:", error);
            await interaction.reply({ content: "スローモードを設定中にエラーが発生しました。", ephemeral: true });
        }
    }
};

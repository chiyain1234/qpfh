const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "MANAGE_CHANNELS",
    botPerm: "MANAGE_CHANNELS",
    data: new SlashCommandSubcommandBuilder()
        .setName("nuke")
        .setDescription("指定したテキストチャンネルのメッセージをすべて削除します。")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("メッセージを削除するチャンネルを選択してください。")
                .setRequired(true)
        ),

    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");

        if (!channel.isText()) {
            await interaction.reply({ content: "このコマンドはテキストチャンネルでのみ使用できます。", ephemeral: true });
            return;
        }

        try {
            const position = channel.position;
            const newChannel = await channel.clone();
            await channel.delete();

            await newChannel.setPosition(position);
            await newChannel.send("このチャンネルは正常に再生成されました。");

            await interaction.reply({ content: `${channel.name} が正常に削除され再作成されました。`, ephemeral: true });
        } catch (error) {
            console.error("チャンネル削除中にエラーが発生しました:", error);
            await interaction.reply({ content: "チャンネル削除中にエラーが発生しました。", ephemeral: true });
        }
    }
};

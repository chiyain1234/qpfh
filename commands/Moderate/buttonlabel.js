const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "ADMINISTRATOR",
    data: new SlashCommandSubcommandBuilder()
        .setName("edit_buttonlabel")
        .setDescription("指定したメッセージ内の一番初めのボタンのラベル名を変更します。")
        .addStringOption(option =>
            option.setName("message_id")
                .setDescription("ボタンを含むメッセージのID")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("new_label")
                .setDescription("新しいボタンのラベル名")
                .setRequired(true)),

    async execute(interaction, client) {
        const messageId = interaction.options.getString("message_id");
        const newButtonLabel = interaction.options.getString("new_label");

        try {
            const channel = await client.channels.fetch(interaction.channelId);
            if (!channel.isText()) {
                await interaction.reply({ content: "このコマンドはテキストチャンネルでのみ使用できます。", ephemeral: true });
                return;
            }

            const message = await channel.messages.fetch(messageId);
            if (!message || !message.components || !message.components.length) {
                await interaction.reply({ content: "指定されたメッセージにボタンが見つかりません。", ephemeral: true });
                return;
            }

            const actionRow = message.components.find(component => component.type === "ACTION_ROW");
            if (!actionRow) {
                await interaction.reply({ content: "指定されたメッセージにボタン行が見つかりません。", ephemeral: true });
                return;
            }

            const button = actionRow.components.find(component => component.type === "BUTTON");
            if (!button) {
                await interaction.reply({ content: "指定されたメッセージにボタンが見つかりません。", ephemeral: true });
                return;
            }

            button.setLabel(newButtonLabel);

            const newActionRow = new MessageActionRow().addComponents(button);
            const newComponents = message.components.map(component => component.type === "ACTION_ROW" ? newActionRow : component);
            await message.edit({ components: newComponents });

            await interaction.reply({ content: "ボタンのラベルが正常に変更されました。", ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: "ボタンのラベルを変更しようとしてエラーが発生しました。", ephemeral: true });
        }
    }
};

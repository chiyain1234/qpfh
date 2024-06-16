const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const cmdName = "embedcolor";

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "ADMINISTRATOR",
    data: new SlashCommandSubcommandBuilder()
        .setName('edit_embedcolor')
        .setDescription('指定されたメッセージ内の埋め込みの色を変更します。')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('埋め込みを含むメッセージのID')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('r')
                .setDescription('赤の値（0-255）')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('g')
                .setDescription('緑の値（0-255）')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('b')
                .setDescription('青の値（0-255）')
                .setRequired(true)),

    async execute(interaction, client) {
        const messageId = interaction.options.getString('message_id');
        const r = interaction.options.getInteger('r');
        const g = interaction.options.getInteger('g');
        const b = interaction.options.getInteger('b');

        try {
            const channel = await client.channels.fetch(interaction.channelId); // コマンドが実行されたチャンネルを取得
            if (!channel.isText()) {
                await interaction.reply({ content: 'このコマンドはテキストチャンネルでのみ使用できます。', ephemeral: true });
                return;
            }

            const message = await channel.messages.fetch(messageId);
            if (!message || !message.embeds.length || message.author.id !== client.user.id) {
                await interaction.reply({ content: 'メッセージが見つかりません、埋め込みを含んでいないか、ボットが送信していない可能性があります。', ephemeral: true });
                return;
            }

            const embed = message.embeds[0];
            const newEmbed = new MessageEmbed(embed)
                .setColor([r, g, b]);

            await message.edit({ embeds: [newEmbed] });
            await interaction.reply({ content: '埋め込みの色が正常に更新されました。', ephemeral: true });
        } catch (error) {
            console.error(error);
            if (error.message.includes('Unknown Message')) {
                await interaction.reply({ content: 'このチャンネルにメッセージが見つかりません。', ephemeral: true });
            } else {
                await interaction.reply({ content: '埋め込みの色を更新しようとしてエラーが発生しました。', ephemeral: true });
            }
        }
    }
};

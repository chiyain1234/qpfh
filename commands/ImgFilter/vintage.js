const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('vintage')
        .setDescription('ユーザーのアバターにヴィンテージ風のフィルターを適用します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ヴィンテージフィルターを適用するユーザーを選択してください')
                .setRequired(false)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // ヴィンテージフィルターを適用する
            applyVintageFilter(context, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'vintage.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Vintage Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://vintage.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });

            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.editReply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    }
};

// ヴィンテージフィルターを適用する関数
function applyVintageFilter(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 色の調整
    for (let i = 0; i < data.length; i += 4) {
        // 赤チャンネル
        data[i] = Math.min(255, data[i] * 1.2);
        // 緑チャンネル
        data[i + 1] = Math.min(255, data[i + 1] * 0.9);
        // 青チャンネル
        data[i + 2] = Math.min(255, data[i + 2] * 0.8);
    }

    context.putImageData(imageData, 0, 0);
}

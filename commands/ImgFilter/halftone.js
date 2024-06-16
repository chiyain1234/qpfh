const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('halftone')
        .setDescription('ユーザーのアバターにハーフトーンフィルターを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ハーフトーンフィルターを適用するユーザーを選択してください')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('blocksize')
                .setDescription('ドットのサイズを設定してください')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(20)
        ),

    async execute(interaction, client) {
        try {
            const user = interaction.options.getUser('target') || interaction.user;
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
            const blockSize = interaction.options.getInteger('blocksize') || 4; // ドットのサイズ

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // ハーフトーンフィルターをかける
            for (let x = 0; x < canvas.width; x += blockSize) {
                for (let y = 0; y < canvas.height; y += blockSize) {
                    const pixelData = context.getImageData(x, y, blockSize, blockSize);
                    const averageColor = getAverageColor(pixelData.data);
                    const grayValue = (averageColor.r + averageColor.g + averageColor.b) / 3;
                    const dotSize = grayValue / 255; // ドットの大きさを灰色の濃さに応じて変化させる
                    const dotSizeNormalized = Math.min(1, Math.max(0.1, dotSize)); // ドットの大きさを0.1から1の範囲に制限
                    context.fillStyle = 'black';
                    context.beginPath();
                    context.arc(x + blockSize / 2, y + blockSize / 2, blockSize / 2 * dotSizeNormalized, 0, Math.PI * 2);
                    context.fill();
                }
            }

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'halftone.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Halftone Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://halftone.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });

            await interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    }
};

// RGB 値の平均を計算する関数
function getAverageColor(pixelData) {
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
        r += pixelData[i];
        g += pixelData[i + 1];
        b += pixelData[i + 2];
    }
    const pixelCount = pixelData.length / 4;
    return {
        r: Math.round(r / pixelCount),
        g: Math.round(g / pixelCount),
        b: Math.round(b / pixelCount)
    };
}

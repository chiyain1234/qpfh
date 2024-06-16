const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('sharpness')
        .setDescription('ユーザーのアバターにシャープネスフィルターを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('シャープネスフィルターを適用するユーザーを選択してください')
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

            // シャープネスフィルターをかける
            applySharpnessFilter(context, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'sharpness.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Sharpness Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://sharpness.png')
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

// シャープネスフィルターを適用する関数
function applySharpnessFilter(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // シャープネスフィルターのカーネル
    const kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixelIndex = (y * width + x) * 4;
            let r = 0, g = 0, b = 0;

            for (let ky = 0; ky < 3; ky++) {
                for (let kx = 0; kx < 3; kx++) {
                    const targetX = x + kx - 1;
                    const targetY = y + ky - 1;
                    const kernelValue = kernel[ky][kx];

                    if (targetX >= 0 && targetX < width && targetY >= 0 && targetY < height) {
                        const neighborPixelIndex = (targetY * width + targetX) * 4;
                        r += data[neighborPixelIndex] * kernelValue;
                        g += data[neighborPixelIndex + 1] * kernelValue;
                        b += data[neighborPixelIndex + 2] * kernelValue;
                    }
                }
            }

            data[pixelIndex] = Math.min(255, Math.max(0, r)); // R
            data[pixelIndex + 1] = Math.min(255, Math.max(0, g)); // G
            data[pixelIndex + 2] = Math.min(255, Math.max(0, b)); // B
        }
    }

    context.putImageData(imageData, 0, 0);
}

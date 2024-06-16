const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('noiseremove')
        .setDescription('ユーザーのアバターにノイズリダクションフィルターを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ノイズリダクションフィルターを適用するユーザーを選択してください')
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

            // ノイズリダクションフィルターをかける
            applyNoiseReductionFilter(context, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'noise_reduction.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Noise Reduction Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://noise_reduction.png')
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

// ノイズリダクションフィルターを適用する関数
function applyNoiseReductionFilter(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 周囲のピクセルから平均値を計算して、中央のピクセルに代入する
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let sumRed = 0, sumGreen = 0, sumBlue = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                    sumRed += data[pixelIndex];
                    sumGreen += data[pixelIndex + 1];
                    sumBlue += data[pixelIndex + 2];
                }
            }

            const targetPixelIndex = (y * width + x) * 4;
            data[targetPixelIndex] = sumRed / 9;
            data[targetPixelIndex + 1] = sumGreen / 9;
            data[targetPixelIndex + 2] = sumBlue / 9;
        }
    }

    context.putImageData(imageData, 0, 0);
}

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName('mosaic')
        .setDescription('ユーザーのアバターにモザイクを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('モザイクをかけるユーザーを選択してください')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('blocksize')
                .setDescription('モザイクのブロックサイズを設定してください')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target')||interaction.user
            const blockSize = interaction.options.getInteger('blocksize')||10
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // モザイクをかける
            for (let x = 0; x < canvas.width; x += blockSize) {
                for (let y = 0; y < canvas.height; y += blockSize) {
                    const pixelData = context.getImageData(x, y, blockSize, blockSize);
                    const averageColor = getAverageColor(pixelData.data);
                    context.fillStyle = `rgb(${averageColor.r}, ${averageColor.g}, ${averageColor.b})`;
                    context.fillRect(x, y, blockSize, blockSize);
                }
            }

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'mosaic.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Mosaic Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://mosaic.png')
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

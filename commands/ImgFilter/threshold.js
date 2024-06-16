const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('threshold')
        .setDescription('ユーザーのアバターに輪郭強調フィルターを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('輪郭強調フィルターをかけるユーザーを選択してください')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('value')
                .setDescription('輪郭を強調するためのしきい値を設定してください')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(255)),

    async execute(interaction, client) {
        try {
            const user = interaction.options.getUser('target')||interaction.user
            const threshold = interaction.options.getInteger('value') || 128;
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // 輪郭強調をかける
            outlineImage(context, canvas.width, canvas.height, threshold);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'outline.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Outlined Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://outline.png')
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

// 画像に輪郭強調をかける関数
function outlineImage(context, width, height, threshold) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 画像のグレースケール化
    for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = brightness;
    }

    // グレースケール画像をもとに輪郭強調
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const pixelBrightness = data[offset];

            if (pixelBrightness > threshold) {
                // ピクセルがしきい値よりも明るい場合、白色に設定
                data[offset] = 255;
                data[offset + 1] = 255;
                data[offset + 2] = 255;
            } else {
                // ピクセルがしきい値以下の場合、黒色に設定
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
            }
        }
    }

    // 変更を適用
    context.putImageData(imageData, 0, 0);
}

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName('blur')
        .setDescription('ユーザーのアバターにブラーを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ブラーをかけるユーザーを選択してください')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('radius')
                .setDescription('ブラーの半径を設定してください')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target')||interaction.user
            const radius = interaction.options.getInteger('radius')||5
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // ぼかしをかける
            blurImage(context, canvas.width, canvas.height, radius);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'blur.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Blurred Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://blur.png')
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

// 画像をぼかす関数
function blurImage(context, width, height, radius) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 各ピクセルに対してぼかしを適用
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let total = 0;

            // 周囲の色の平均を計算
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
                        const offset = (ny * width + nx) * 4;
                        r += data[offset];
                        g += data[offset + 1];
                        b += data[offset + 2];
                        a += data[offset + 3];
                        total++;
                    }
                }
            }

            // 平均値を計算して設定
            const offset = (y * width + x) * 4;
            data[offset] = r / total;
            data[offset + 1] = g / total;
            data[offset + 2] = b / total;
            data[offset + 3] = a / total;
        }
    }
    
    // 変更を適用
    context.putImageData(imageData, 0, 0);
    
}
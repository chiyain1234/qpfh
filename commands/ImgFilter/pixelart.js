const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('pixelart')
        .setDescription('ユーザーのアバターにドット絵のフィルターを適用します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ドット絵のフィルターを適用するユーザーを選択してください')
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

            // ドット絵のフィルターを適用する
            applyPixelArtFilter(context, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'pixelart.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Pixel Art Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://pixelart.png')
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

// ドット絵のフィルターを適用する関数
function applyPixelArtFilter(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // ピクセルごとの処理
    for (let y = 0; y < height; y += 5) {
        for (let x = 0; x < width; x += 5) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // RGB値をそのままにしてドット状の塗りつぶしを行う
            for (let dx = 0; dx < 5; dx++) {
                for (let dy = 0; dy < 5; dy++) {
                    const pixelIndex = ((y + dy) * width + (x + dx)) * 4;
                    data[pixelIndex] = r;
                    data[pixelIndex + 1] = g;
                    data[pixelIndex + 2] = b;
                }
            }
        }
    }

    context.putImageData(imageData, 0, 0);
}

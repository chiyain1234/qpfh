const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('deepfry')
        .setDescription('画像の彩度を強調する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('彩度を強調するユーザーを選択してください')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('strength')
                .setDescription('彩度の強さを設定してください（1〜200）')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(200)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const strengther = interaction.options.getInteger('strength')||50;
            const strength = strengther + 100;
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // 彩度を強調
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            enhanceSaturation(imageData, strength);
            context.putImageData(imageData, 0, 0);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'highsaturation.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Deepfried')
                .setDescription(`${user.username}`)
                .setImage('attachment://highsaturation.png')
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

// 彩度を強調する関数
function enhanceSaturation(imageData, strength) {
    const data = imageData.data;
    const adjustment = strength / 100;

    for (let i = 0; i < data.length; i += 4) {
        const maxRGB = Math.max(data[i], data[i + 1], data[i + 2]);
        const minRGB = Math.min(data[i], data[i + 1], data[i + 2]);
        const avgRGB = (maxRGB + minRGB) / 2;
        data[i] = avgRGB + adjustment * (data[i] - avgRGB);
        data[i + 1] = avgRGB + adjustment * (data[i + 1] - avgRGB);
        data[i + 2] = avgRGB + adjustment * (data[i + 2] - avgRGB);
    }
}

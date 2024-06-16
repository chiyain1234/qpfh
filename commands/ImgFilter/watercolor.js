const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('watercolor')
        .setDescription('ユーザーのアバターに水彩画風のフィルターを適用します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('水彩画風のフィルターを適用するユーザーを選択してください')
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

            // 水彩画風のフィルターを適用する
            applyWatercolorFilter(context, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'watercolor.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Watercolor Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://watercolor.png')
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

// 水彩画風のフィルターを適用する関数
function applyWatercolorFilter(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // ピクセルごとの処理
    for (let i = 0; i < data.length; i += 1) {
        // RGB値をランダムに変更して水彩画風の効果を与える
        const offset = Math.floor(Math.random() * 20) - 10;
        data[i] += offset;
        data[i + 1] += offset;
        data[i + 2] += offset;
    }

    context.putImageData(imageData, 0, 0);
}

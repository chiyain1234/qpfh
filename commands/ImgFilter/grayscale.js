const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName('grayscale')
        .setDescription('ユーザーのアバターに白黒フィルターを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('白黒にするユーザーを選択してください')
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

            // モノクロに変換
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            monochromeImage(imageData);
            context.putImageData(imageData, 0, 0);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'monochrome.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Monochrome Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://monochrome.png')
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

// 画像をモノクロに変換する関数
function monochromeImage(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // 赤
        data[i + 1] = avg; // 緑
        data[i + 2] = avg; // 青
    }
}

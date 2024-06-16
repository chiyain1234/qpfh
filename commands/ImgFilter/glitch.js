const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const { randomInt } = require('crypto');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('glitch')
        .setDescription('ユーザーのアバターにグリッチ効果を適用します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('グリッチ効果を適用するユーザーを選択してください')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('intensity')
                .setDescription('グリッチの強度を設定してください (1〜10)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const intensity = interaction.options.getInteger('intensity')||5
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // グリッチ効果を適用
            applyGlitchEffect(context, canvas.width, canvas.height, intensity);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'glitch.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Glitch Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://glitch.png')
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

// グリッチ効果を適用する関数
function applyGlitchEffect(context, width, height, intensity) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < intensity / 10) {
            const offset = randomInt(-2, 2) * 4;
            data[i] = data[i + offset]; // R
            data[i + 1] = data[i + offset + 1]; // G
            data[i + 2] = data[i + offset + 2]; // B
        }
    }

    context.putImageData(imageData, 0, 0);
}

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('retro')
        .setDescription('ユーザーのアバターにレトロフィルターを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('レトロフィルターを適用するユーザーを選択してください')
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

            // 色調の変更（例: セピア調）
            context.fillStyle = 'rgba(112, 66, 20, 0.3)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            // ノイズの追加
            addNoise(context, canvas.width, canvas.height, 50);

            // ビンテージ効果の追加
            context.globalCompositeOperation = 'overlay';
            context.fillStyle = 'rgba(255, 255, 255, 0.1)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'retro.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Retro Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://retro.png')
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

// ノイズを追加する関数
function addNoise(context, width, height, amount) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = amount * (Math.random() * 2 - 1);
        data[i] += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
    }
    context.putImageData(imageData, 0, 0);
}

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('goodfriend')
        .setDescription('指定したユーザーとあなたは良い友達です。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(true)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const executor = interaction.user;
            const target = interaction.options.getUser('target');

            const imagePath = path.join(__dirname, '../../Images', 'goodfriend.png');
            const handImage = await Canvas.loadImage(imagePath);

            const executorAvatarURL = executor.displayAvatarURL({ format: 'png', size: 256 });
            const targetAvatarURL = target.displayAvatarURL({ format: 'png', size: 256 });

            const executorAvatar = await Canvas.loadImage(executorAvatarURL);
            const targetAvatar = await Canvas.loadImage(targetAvatarURL);

            // 新しいサイズ（最大の高さと最大の幅を使用）
            const avatarSize = 512;

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarSize * 2, avatarSize);
            const context = canvas.getContext('2d');

            // 実行者のアバターをリサイズして描画
            context.drawImage(executorAvatar, 0, 0, avatarSize, avatarSize);

            // 指定したユーザーのアバターをリサイズして描画
            context.drawImage(targetAvatar, avatarSize, 0, avatarSize, avatarSize);

            // handImageを少し大きくしてキャンバスの中心に配置
            const handImageScale = 1.2;
            const handImageWidth = handImage.width * handImageScale;
            const handImageHeight = handImage.height * handImageScale;
            const handImageX = (canvas.width - handImageWidth) / 2;
            const handImageY = (canvas.height - handImageHeight) / 2 + 100; // 少し下に配置

            context.drawImage(handImage, handImageX, handImageY, handImageWidth, handImageHeight);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'goodfriend.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('仲良し✌')
                .setDescription(`${executor.username} & ${target.username}`)
                .setImage('attachment://goodfriend.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });

            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.editReply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    },
};

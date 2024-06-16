const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName('fusion')
        .setDescription('二つの画像を重ね合わせます。')
        .addUserOption(option =>
            option.setName('base')
                .setDescription('ベースとなるユーザーを選択してください')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('overlay')
                .setDescription('重ねるユーザーを選択してください')
                .setRequired(true)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const baseUser = interaction.options.getUser('base');
            const overlayUser = interaction.options.getUser('overlay');

            const baseAvatarURL = baseUser.displayAvatarURL({ format: 'png', size: 256 });
            const overlayAvatarURL = overlayUser.displayAvatarURL({ format: 'png', size: 256 });

            // ベースとなる画像を読み込んでバッファに変換
            const baseAvatarBuffer = await Canvas.loadImage(baseAvatarURL);
            // 重ねる画像を読み込んでバッファに変換
            const overlayAvatarBuffer = await Canvas.loadImage(overlayAvatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(baseAvatarBuffer.width, baseAvatarBuffer.height);
            const context = canvas.getContext('2d');

            // ベース画像をキャンバスに描画
            context.drawImage(baseAvatarBuffer, 0, 0, canvas.width, canvas.height);

            // 重ねる画像の透明度を設定してから描画
            context.globalAlpha = 0.5; // 透明度を 0.5 に設定
            context.drawImage(overlayAvatarBuffer, 0, 0, canvas.width, canvas.height);

            // 透明度を元に戻す
            context.globalAlpha = 1;

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'fusion.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Fusion')
                .setDescription(`${baseUser.username} & ${overlayUser.username}`)
                .setImage('attachment://fusion.png')
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

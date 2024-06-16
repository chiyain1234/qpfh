const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('transparent')
        .setDescription('画像に透明化フィルターを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('透明化するユーザーを選択してください')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('opacity')
                .setDescription('透明度を設定してください (0から100まで)')
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(100)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const opacity = interaction.options.getInteger('opacity') || 50; // デフォルトの透明度は50%

            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // 透明度を設定
            context.globalAlpha = opacity / 100;

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'transparent.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Transparent Filter')
                .setDescription(`${user.username}`)
                .setImage('attachment://transparent.png')
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

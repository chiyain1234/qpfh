const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

const cmdName = "rainbow";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('虹色の旗でアバターを作成します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
            const avatarImage = await Canvas.loadImage(avatarURL);

            const imagePath = path.join(__dirname, '../../Images', 'rainbow.png');
            const Image = await Canvas.loadImage(imagePath);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarImage.width, avatarImage.height);
            const ctx = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            ctx.drawImage(Image, 0, 0, canvas.width, canvas.height);

            ctx.globalAlpha = 0.5;  // 透過度を設定 (0.0 - 完全に透明, 1.0 - 完全に不透明)
            ctx.drawImage(avatarImage, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;  // 透過度を元に戻す

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'rainbow.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`_${user.username}_`)
                .setImage('attachment://rainbow.png')
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

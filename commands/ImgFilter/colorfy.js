const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

const cmdName = "colorfy";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定したユーザーのアバターに指定した色でオーバーレイします。')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('ユーザーを選択してください')
            .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
            .setDescription('オーバーレイの色を指定してください（例：#FF0000）')
            .setRequired(false)),

    async execute(interaction, client) {
        try {

            const user = interaction.options.getUser('target') || interaction.user;
            let color = interaction.options.getString('color') || "#00FF00";

            // カラーコードに # を追加
            if (!color.startsWith('#')) {
                color = '#' + color;
            }

            // カラーコードの形式をチェック
            const colorRegex = /^#[0-9a-fA-F]{6}$/;
            if (!colorRegex.test(color)) {
                await interaction.reply({ content: '無効なカラーコードです', ephemeral: true });
            } else {
                await interaction.deferReply();
                const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
                const avatarImage = await Canvas.loadImage(avatarURL);

                // キャンバスのセットアップ
                const canvas = Canvas.createCanvas(avatarImage.width, avatarImage.height);
                const ctx = canvas.getContext('2d');

                // アバター画像をキャンバスに描画
                ctx.drawImage(avatarImage, 0, 0, canvas.width, canvas.height);

                // 指定した色でオーバーレイを描画
                ctx.globalAlpha = 0.5; // 透過度を設定（例：50%）
                ctx.fillStyle = color; // 指定した色を設定
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1.0; // 透過度を元に戻す

                // 画像をバッファに変換
                const attachment = new MessageAttachment(canvas.toBuffer(), 'avatar-with-overlay.png');

                const embed = new MessageEmbed()
                    .setColor(client.config.color)
                    .setDescription(`${user.username}'s avatar with ${color} overlay`)
                    .setImage('attachment://avatar-with-overlay.png')
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                    .setTimestamp()
                    .setFooter({ text: interaction.toString() });

                await interaction.editReply({ embeds: [embed], files: [attachment] });
            }
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.editReply({ content: error.message || 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    },
};
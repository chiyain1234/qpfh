const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

const cmdName = "recaptcha";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定したユーザーでrecaptchaします。')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('テキストを入力してください')
                .setRequired(true))
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

            // 重ねる画像のパス（ここではrecaptcha.pngとします）
            const overlayImagePath = path.join(__dirname, '../../Images', 'recaptcha.png');
            const overlayImage = await Canvas.loadImage(overlayImagePath);

            // ユーザーが指定した白い文字（ここではコマンドのオプションから取得）
            const userText = interaction.options.getString('text') || '';

            // Canvasを作成（固定サイズ 300x384）
            const canvas = Canvas.createCanvas(300, 384);
            const ctx = canvas.getContext('2d');

            // アバター画像を横幅に合わせて一番下に配置
            const avatarScaleFactor = canvas.width / avatarImage.width;
            const avatarScaledHeight = avatarImage.height * avatarScaleFactor;
            ctx.drawImage(avatarImage, 0, canvas.height - avatarScaledHeight, canvas.width, avatarScaledHeight);

            // 重ねる画像を上から配置（サイズは300x384に調整）
            ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

            // ユーザーが指定した白い文字を描画
            ctx.fillStyle = '#ffffff'; // 白色
            ctx.textAlign = 'left';
            ctx.font = '30px sans-serif'; // フォントサイズや種類を調整可能

            // テキストの幅を取得
            const textWidth = ctx.measureText(userText).width;

            // テキストの描画位置を計算
            const textX = 35; // 固定の左端位置
            const textY = 40; // y座標を少し上に移動（例えば20程度）
            ctx.fillText(userText, textX, textY); // 座標にテキストを描画

            // 生成したCanvasをファイルに変換して送信
            const attachment = new MessageAttachment(canvas.toBuffer(), 'recaptcha.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`_${user.username}_`)
                .setImage('attachment://recaptcha.png')
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

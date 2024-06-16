const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');
const fs = require('fs').promises;
const cmdName = "robokasu"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('鬼畜ロボットの画像を生成します。')
        .addStringOption(option =>
            option.setName('text')
            .setDescription('テキストを入力してください')
            .setRequired(true)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const text = interaction.options.getString('text').replace(/\\n/g, '\n'); // テキスト内の \n を改行文字に置換

            // 画像を読み込んでバッファに変換
            const imagePath = path.join(__dirname, '../../Images', 'robokasu.png');
            const imageBuffer = await fs.readFile(imagePath);
            const background = await Canvas.loadImage(imageBuffer);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(background.width, background.height);
            const context = canvas.getContext('2d');

            // 日本語のフォントを指定して設定
            context.font = '35px "Noto Sans JP"'; // フォントサイズを 30px に変更

            // 画像をキャンバスに描画
            context.drawImage(background, 0, 0);

            // テキストの各行を分割して、各行の幅を計算
            const lines = text.split('\n');
            const lineWidths = lines.map(line => context.measureText(line).width);

            // 最も幅が長い行の幅を取得
            const maxWidth = Math.max(...lineWidths);

            // テキスト全体の高さを計算
            const lineHeight = parseInt(context.font, 10); // テキストの行の高さ
            const totalTextHeight = lines.length * lineHeight; // テキスト全体の高さ

            // 指定した座標の周りにテキストを配置するための座標を計算
            const x = 240 - maxWidth / 2; // X 座標
            const y = 160 - totalTextHeight / 2 + lineHeight / 2; // Y 座標（テキストの中央に配置）

            // テキストをキャンバスに描画
            context.fillStyle = '#000000'; // テキストの色を黒に設定
            lines.forEach((line, index) => {
                const yOffset = y + index * lineHeight; // 各行の Y 座標を計算
                context.fillText(line, x, yOffset); // 指定した座標の周りにテキストを描画
            });

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'robokasu.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
                .setImage('attachment://robokasu.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });

            return interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.editReply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    }

};
const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('symmetry')
        .setDescription('指定したユーザーのアバターを左右対称にします。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('direction')
                .setDescription('左右対称の方向を選択してください (left, right)')
                .setRequired(false)
                .addChoices(
                    { name: '左側', value: 'left' },
                    { name: '右側', value: 'right' })),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const direction = interaction.options.getString('direction')||"left";
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ（元画像の幅の2倍、元画像の高さと同じ）
            const canvas = Canvas.createCanvas(avatarBuffer.width * 2, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // 左右の対称画像を描画する領域の幅
            const halfWidth = avatarBuffer.width / 2;

            // 画像を左右に分割して反転して描画
            if (direction === 'left') {
                // 左側の元画像を描画
                context.drawImage(avatarBuffer, 0, 0, halfWidth, avatarBuffer.height, 0, 0, halfWidth, avatarBuffer.height);
                // 右側の反転画像を描画
                context.save();
                context.scale(-1, 1);
                context.drawImage(avatarBuffer, 0, 0, halfWidth, avatarBuffer.height, -halfWidth * 2, 0, halfWidth, avatarBuffer.height);
                context.restore();
            } else if (direction === 'right') {
                // 右側の元画像を描画
                context.drawImage(avatarBuffer, halfWidth, 0, halfWidth, avatarBuffer.height, halfWidth, 0, halfWidth, avatarBuffer.height);
                // 左側の反転画像を描画
                context.save();
                context.scale(-1, 1);
                context.drawImage(avatarBuffer, halfWidth, 0, halfWidth, avatarBuffer.height, -halfWidth, 0, halfWidth, avatarBuffer.height);
                context.restore();
            }

            // 画像をバッファに変換（元の画像と同じサイズ）
            const finalCanvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const finalContext = finalCanvas.getContext('2d');
            finalContext.drawImage(canvas, (avatarBuffer.width / 4)-64, 0, avatarBuffer.width , avatarBuffer.height, 0, 0, avatarBuffer.width, avatarBuffer.height);

            // バッファを添付ファイルとして送信
            const attachment = new MessageAttachment(finalCanvas.toBuffer(), 'symmetry.png');

            // レスポンスとして送信する埋め込みメッセージの作成
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Symmetry Avatar')
                .setDescription(`${user.username} (${direction === 'left' ? '左側左右対称' : '右側左右対称'})`)
                .setImage('attachment://symmetry.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });

            // 返信
            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('コマンドの実行中にエラーが発生しました:', error);
            await interaction.editReply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    }
};

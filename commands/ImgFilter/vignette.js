const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('vignette')
        .setDescription('ユーザーのアバターにビネット（白または黒）を適用します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください。')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('ビネットの色を指定してください（white / black）')
                .setRequired(false)
                .addChoices({name: '白', value: 'white'},
                            {name: '黒', value: 'black'})),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const vignetteColor = interaction.options.getString('color')||'white'
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // ビネットを適用
            applyVignette(context, canvas.width, canvas.height, vignetteColor);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'vignette.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Vignetted Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://vignette.png')
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

// ビネットを適用する関数
function applyVignette(context, width, height, color) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.sqrt(centerX * centerX + centerY * centerY);
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

    if (color === 'white') {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    } else if (color === 'black') {
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
}

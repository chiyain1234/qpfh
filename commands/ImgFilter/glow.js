const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('glow')
        .setDescription('指定したユーザーのアバターを発光します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('発光するユーザーのアバターを選択してください')
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

            // 輝きフィルターを適用
            applyGlowFilter(context, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'golden-avatar.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Glowed')
                .setDescription(`${user.username}`)
                .setImage('attachment://golden-avatar.png')
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

// 輝きフィルターを適用する関数
function applyGlowFilter(context, width, height) {
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = 'rgba(255, 255, 200, 0.4)';
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
}
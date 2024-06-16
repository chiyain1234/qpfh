const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('sepia')
        .setDescription('ユーザーのアバターにセピアフィルターを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('セピアフィルターを適用するユーザーを選択してください')
                .setRequired(false)),

    async execute(interaction, client) {
        try {
            const user = interaction.options.getUser('target')||interaction.user
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // セピアフィルターをかける
            context.fillStyle = 'rgba(255, 230, 180, 0.5)'; // セピア調の色
            context.fillRect(0, 0, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'sepia.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Sepia Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://sepia.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });

            await interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    }
};

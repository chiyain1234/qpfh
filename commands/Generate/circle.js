const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('circle')
        .setDescription('指定したユーザーのアバターを円形にカットします。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(512, 512);
            const context = canvas.getContext('2d');

            // 円形にクリップ
            context.beginPath();
            context.arc(256, 256, 256, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            // 背景を白に設定
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, 512, 512);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'circle-avatar.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Circle Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://circle-avatar.png')
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

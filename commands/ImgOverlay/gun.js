const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

const cmdName = "gun";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定したユーザーのアバターが発砲します。')
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

            // gun.pngの読み込み
            const imagePath = path.join(__dirname, '../../Images', 'gun.png');
            const Image = await Canvas.loadImage(imagePath);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarImage.width, avatarImage.height);
            const ctx = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            ctx.drawImage(avatarImage, 0, 0, canvas.width, canvas.height);

            // gun.pngをキャンバスに描画
            ctx.drawImage(Image, 0, 0, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'avatar-with-gun.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`_${user.username} has a gun_`)
                .setImage('attachment://avatar-with-gun.png')
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

const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('flip')
        .setDescription('指定したユーザーのアバターを反転します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('direction')
                .setDescription('反転の方向を選択してください (left-right, up-down, both)')
                .setRequired(false)
                .addChoices(
                    { name: 'Left-Right', value: 'left-right' },
                    { name: 'Up-Down', value: 'up-down' },
                    { name: 'Both', value: 'both' })),  // 'both' も追加

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const direction = interaction.options.getString('direction') || 'left-right';
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // 反転の処理
            if (direction === 'left-right') {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
            } else if (direction === 'up-down') {
                context.translate(0, canvas.height);
                context.scale(1, -1);
            } else if (direction === 'both') {  // 両方の反転
                context.translate(canvas.width, canvas.height);
                context.scale(-1, -1);
            }

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'flipped-avatar.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Flipped Avatar')
                .setDescription(`${user.username} (${direction.replace('-', ' ').toUpperCase()})`)
                .setImage('attachment://flipped-avatar.png')
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

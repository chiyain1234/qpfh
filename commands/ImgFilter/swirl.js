const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName('swirl')
        .setDescription('ユーザーのアバターに渦巻きを適用する。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('strength')
                .setDescription('渦巻きの強度を設定してください（1-10）')
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(10))
        .addStringOption(option =>
            option.setName('direction')
                .setDescription('渦巻きの方向を指定してください（clockwise / counterclockwise）')
                .setRequired(false)
                .addChoices({name: '時計回り', value: 'clockwise'},
                            {name: '反時計回り', value: 'counterclockwise'})),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const strength = interaction.options.getNumber('strength') || 0.5;
            const direction = interaction.options.getString('direction') || 'clockwise';
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

  
            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // キャンバスのセットアップ
            const canvas = Canvas.createCanvas(avatarBuffer.width, avatarBuffer.height);
            const context = canvas.getContext('2d');

            // アバター画像をキャンバスに描画
            context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);

            // 渦巻きをかける
            swirlImage(context, canvas.width, canvas.height, strength, direction);

            // 画像をバッファに変換
            const attachment = new MessageAttachment(canvas.toBuffer(), 'swirl.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Swirled Avatar')
                .setDescription(`${user.username}`)
                .setImage('attachment://swirl.png')
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

// 画像を渦巻き状に変形させる関数
function swirlImage(context, width, height, strength, direction) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2;

    // 各ピクセルに対して渦巻きを適用
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX);
            let swirl = strength * (radius - distance) / radius;

            if (direction === 'counterclockwise') {
                swirl *= -1;
            }

            const newX = centerX + Math.cos(angle + swirl) * distance;
            const newY = centerY + Math.sin(angle + swirl) * distance;

            if (newX >= 0 && newY >= 0 && newX < width && newY < height) {
                const newPixel = getPixel(data, Math.floor(newX), Math.floor(newY), width, height);
                const offset = (y * width + x) * 4;
                data[offset] = newPixel.r;
                data[offset + 1] = newPixel.g;
                data[offset + 2] = newPixel.b;
                data[offset + 3] = newPixel.a;
            }
        }
    }

    // 変更を適用
    context.putImageData(imageData, 0, 0);
}

// 指定した座標のピクセルの色情報を取得する関数
function getPixel(data, x, y, width, height) {
    const offset = (y * width + x) * 4;
    return {
        r: data[offset],
        g: data[offset + 1],
        b: data[offset + 2],
        a: data[offset + 3]
    };
}
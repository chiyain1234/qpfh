const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('blowup')
        .setDescription('指定したユーザーのアバターを引き延ばします。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('direction')
                .setDescription('引き延ばす方向を選択してください (left-right または up-down)')
                .setRequired(false)
                .addChoices({ name: '左右', value: 'left-right' },
                            { name: '上下', value: 'up-down' }))
        .addIntegerOption(option =>
            option.setName('scale')
                .setDescription('引き延ばしの度合いを設定してください (1-10)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const direction = interaction.options.getString('direction')||"left-right";
            const scale = interaction.options.getInteger('scale')||2;
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });

            const avatarBuffer = await Canvas.loadImage(avatarURL);

            let canvasWidth = avatarBuffer.width, canvasHeight = avatarBuffer.height;
            if (direction === 'left-right') {
                canvasWidth *= scale;
            } else if (direction === 'up-down') {
                canvasHeight *= scale;
            }

            const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
            const context = canvas.getContext('2d');

            if (direction === 'left-right') {
                context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);
            } else if (direction === 'up-down') {
                context.drawImage(avatarBuffer, 0, 0, canvas.width, canvas.height);
            }

            const attachment = new MessageAttachment(canvas.toBuffer(), 'stretched-avatar.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Blowuped Avatar')
                .setDescription(`${user.username} (${direction.replace('-', ' ').toUpperCase()})`)
                .setImage('attachment://stretched-avatar.png')
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

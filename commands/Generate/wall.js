const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('wall')
        .setDescription('指定したユーザーのアバターを3x3に並べて表示します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください。')
                .setRequired(false)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const targetUser = interaction.options.getUser('target') || interaction.user;

             // ユーザーのアバターを取得してサイズを取得
             const avatarURL = targetUser.displayAvatarURL({ format: 'png', size: 256 });
             const avatar = await Canvas.loadImage(avatarURL);
             const avatarWidth = avatar.width;
             const avatarHeight = avatar.height;
 
       // アバター画像を3x3に配置
       const canvas = Canvas.createCanvas(avatarWidth * 3, avatarHeight * 3);
       const ctx = canvas.getContext('2d');

       for (let i = 0; i < 3; i++) {
           for (let j = 0; j < 3; j++) {
               ctx.drawImage(avatar, j * avatarWidth, i * avatarHeight, avatarWidth, avatarHeight);
           }
       }

       // 元の画像サイズに調整
       const resizedCanvas = Canvas.createCanvas(avatarWidth, avatarHeight);
       const resizedCtx = resizedCanvas.getContext('2d');
       resizedCtx.drawImage(canvas, 0, 0, avatarWidth, avatarHeight);
       const attachment = new MessageAttachment(resizedCanvas.toBuffer(), 'avatarwall.png');

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Avatar Wall')
                .setDescription(`${targetUser.username}'s avatar : 3x3`)
                .setImage('attachment://avatarwall.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });


                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('regen_wall')
                        .setLabel('Regen')
                        .setStyle('PRIMARY')
                );

            await interaction.editReply({ embeds: [embed], files: [attachment], components: [row] });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.editReply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    },
};
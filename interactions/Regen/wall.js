const client = require('../../index.js');
const { MessageActionRow, MessageEmbed, MessageButton, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

client.on("interactionCreate", async (i) => {

    if (i.customId === "regen_wall") {
        const msgs = await i.channel.messages.fetch(i.message.id)
        const image = msgs.embeds[0].image

        try {
            await i.deferReply();

            const avatar = await Canvas.loadImage(image.url);
            const avatarWidth = avatar.width;
            const avatarHeight = avatar.height;

            const canvas = Canvas.createCanvas(avatarWidth * 3, avatarHeight * 3);
            const ctx = canvas.getContext('2d');

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    ctx.drawImage(avatar, j * avatarWidth, i * avatarHeight, avatarWidth, avatarHeight);
                }
            }

            const resizedCanvas = Canvas.createCanvas(avatarWidth, avatarHeight);
            const resizedCtx = resizedCanvas.getContext('2d');
            resizedCtx.drawImage(canvas, 0, 0, avatarWidth, avatarHeight);

            const img = resizedCanvas.toBuffer()
            const attachment = new MessageAttachment(img, 'avatarwall.png');
            const embed = new MessageEmbed()
                .setColor(msgs.embeds[0].color)
                .setTitle('Avatar Wall')
                .setDescription(msgs.embeds[0].description)
                .setImage('attachment://avatarwall.png')
                .setAuthor(msgs.embeds[0].author)
                .setFooter(msgs.embeds[0].footer)
                .setTimestamp();

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId('regen_wall')
                .setLabel('Regen')
                .setStyle('PRIMARY')
            );

            await i.editReply({ embeds: [embed], files: [attachment], components: [row] });
        } catch (error) {
            console.error('Error executing command:', error);
            await i.editReply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    }
})
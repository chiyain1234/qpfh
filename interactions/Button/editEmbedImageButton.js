const client = require('../../index.js')
const { MessageActionRow, Modal, TextInputComponent, MessageEmbed, MessageButton } = require('discord.js');

client.on("interactionCreate", async (i) => {

    if (i.customId === "editEmbedImage") {

        const modal = new Modal()
            .setCustomId('embedEditImageModal')
            .setTitle('埋め込みメッセージ編集')
        const image = new TextInputComponent()
            .setCustomId('embedImage')
            .setLabel("画像URLを入力してください。")
            .setPlaceholder("画像URLを入力")
            .setStyle('SHORT');

        const one = new MessageActionRow().addComponents(image);

        modal.addComponents(one);

        await i.showModal(modal);
    }

    if (i.customId === "embedEditImageModal") {

        let msgs = await i.channel.messages.fetch(i.message.id)

        await i.deferUpdate()
        const image = i.fields.getTextInputValue("embedImage")

        const Embed = new MessageEmbed()
            .setColor(msgs.embeds[0].color)
            .setAuthor({ name: msgs.embeds[0].author.name || "", iconURL: ``, url: '' })
            .setFooter({ text: msgs.embeds[0].footer.text || "", iconURL: '' })
            .setTitle(msgs.embeds[0].title)
            .setImage(image)
            .setThumbnail(msgs.embeds[0].thumbnail || "")
            .setDescription(msgs.embeds[0].description)
            .setTimestamp()

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId(`editEmbedImage`)
                .setLabel(`Add Image`)
                .setStyle(`SECONDARY`),
            )
            .addComponents(
                new MessageButton()
                .setCustomId(`editEmbedThumbnail`)
                .setLabel(`Add Thumbnail`)
                .setStyle(`SECONDARY`),
            )
            .addComponents(
                new MessageButton()
                .setCustomId(`editEmbedComplete`)
                .setLabel(`Complete`)
                .setStyle(`SUCCESS`),
            )

        return msgs.edit({ embeds: [Embed], components: [button] });

    }

})
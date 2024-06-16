const client = require('../../index.js')
const { MessageActionRow, MessageEmbed, MessageButton, Modal, TextInputComponent } = require('discord.js');

client.on("interactionCreate", async (i) => {
    if (i.customId === "free_channel") {

        const title1 = i.fields.getTextInputValue("title"),
              description1 = i.fields.getTextInputValue("description"),
              footer1 = i.fields.getTextInputValue("footer"),
              author1 = i.fields.getTextInputValue("author"),
              color1 = i.fields.getTextInputValue("color") || "#ffffff";

        if (!title1 && !description1) {
            return i.reply({
                content: "入力していない項目があります。",
                ephemeral: true
            });
        }

        const Embed = new MessageEmbed()
            .setColor(color1)
            .setAuthor({ name: `${author1}`, iconURL: ``, url: '' })
            .setFooter({ text: `${footer1}`, iconURL: '' })
            .setTitle(title1)
            .setDescription(description1)
            .setTimestamp();

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`freechannel_button`)
                    .setLabel(`Create`)
                    .setEmoji("➕")
                    .setStyle(`SUCCESS`)
            );

        return i.reply({ embeds: [Embed], components: [button] });
    }

    if (i.customId === "freechannel_button") {
        const modal = new Modal()
            .setCustomId('free-channel')
            .setTitle('フリーチャンネル作成');

        const ch = new TextInputComponent()
            .setCustomId('channel-name')
            .setLabel("チャンネル名を入力してください。")
            .setPlaceholder("チャンネル名を入力")
            .setRequired(true)
            .setStyle('SHORT');

        const one = new MessageActionRow().addComponents(ch);
        modal.addComponents(one);

        await i.showModal(modal);
    }

    if (i.customId === "free-channel") {
        const name = i.fields.getTextInputValue('channel-name');

        try {
            const createdChannel = await i.guild.channels.create(name, { type: 'GUILD_TEXT', parent: i.channel.parent });

            // Update channel topic with user info
            await createdChannel.setTopic(`Created by ${i.user.tag} (${i.user.id})`);

            // Mention the user who pressed the button
            await createdChannel.send(`<@${i.user.id}> によるフリーチャンネルです。`);

            await i.reply({
                content: `チャンネルを作成しました。`,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await i.reply({
                content: `チャンネルを作成できませんでした。`,
                ephemeral: true
            });
        }
    }
});

const client = require('../../index.js')
const Discord = require("discord.js")
const { MessageActionRow, MessageButton } = require('discord.js');
var validUrl = require('valid-url');

client.on("interactionCreate", async (i, client) => {

    if (i.customId === "button") {

        const labelValue = i.fields.getTextInputValue("label"),
            urlsValue = i.fields.getTextInputValue("urls")

        if (!labelValue && !urlsValue) return i.reply({
            content: "入力していない項目があります。",
            ephemeral: true
        });

        var url = `${urlsValue}`
        if (validUrl.isUri(url)) {
            const button = new MessageActionRow()

                .addComponents(
                    new MessageButton()
                    .setLabel(`${labelValue}`)
                    .setStyle('LINK')
                    .setURL(`${urlsValue}`),
                )
            await i.reply({ content: 'Processing your command...', ephemeral: true });
            await i.deleteReply()
            await i.channel.send({ components: [button] });
        } else {
            const Deembed = new Discord.MessageEmbed()
                .setTitle("エラー")
                .setDescription(`これはURLでありません。`)
                .setColor("RED");
            i.reply({ embeds: [Deembed], ephemeral: true })
        }
    }
})
const client = require('../../index.js')
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const math = require('mathjs');

client.on("interactionCreate", async (i) => {

    if (i.customId === "counter") {
        let msgs = await i.channel.messages.fetch(i.message.id)

        msgs.embeds.forEach(async (lembed) => {
            await i.deferUpdate()

            var cal = `${lembed.description}+1`
            const result = math.evaluate(cal);

            const tEmbed = new MessageEmbed()
                .setColor(config.color)
                .setTitle(`カウンター`)
                .setDescription(`${result}`)
                .setTimestamp()

            const button = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`counter`)
                    .setLabel(`Count!`)
                    .setStyle(`SUCCESS`),
                )

            await msgs.edit({ embeds: [tEmbed], components: [button] });
        })
    }
})
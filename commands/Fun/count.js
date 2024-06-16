const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');

const cmdName = "count"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("カウントパネルを作成する。"),

    async execute(i, client) {
        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`カウンター`)
            .setDescription(`0`)
            .setTimestamp()

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId(`counter`)
                .setLabel(`Count!`)
                .setStyle(`SUCCESS`),
            )

       await i.reply({ embeds: [Embed], components: [button] });
    }

}
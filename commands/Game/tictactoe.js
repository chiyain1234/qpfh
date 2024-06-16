const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const cmdName = "tictactoe";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
	cooldown: 5,
    data: new SlashCommandSubcommandBuilder()
        .setName("tictactoe")
        .setDescription("ボットと○×ゲームをする。"),

    async execute(i, client) {
        const createButton = (customId, label, style) => new MessageButton()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style);

    const createRow = (buttonIds) => new MessageActionRow()
        .addComponents(buttonIds.map(id => createButton(`ttt_${id}`, '-', 'SECONDARY')));

    const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
        .setTitle("〇×ゲーム")
        .setTimestamp()
        .setFooter({ text: i.toString(), iconURL: '' });

    const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const rows = [buttons.slice(0, 3), buttons.slice(3, 6), buttons.slice(6, 9)];

    const actionRows = rows.map(row => createRow(row));

    await i.reply({ embeds: [embed], components: actionRows });
    }
};

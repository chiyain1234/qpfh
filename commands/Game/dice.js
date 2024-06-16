const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const cmdName = "rps";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
	cooldown: 5,
    data: new SlashCommandSubcommandBuilder() 
    .setName('dice')
    .setDescription('サイコロを振ります。')
    .addIntegerOption(option =>
        option.setName('max')
            .setDescription('サイコロの最大値を指定します。')
            .setRequired(false)),

    async execute(i, client) {
        const max = i.options.getInteger('max') || 6;
        const diceResult = Math.floor(Math.random() * max) + 1;

            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
                .setTitle('サイコロ')
                .setDescription(`出た目: ${diceResult}`)
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            await i.reply({ embeds: [Embed] })
        }
};

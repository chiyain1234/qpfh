const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const Memer = require("random-jokes-api");
const cmdName = "uselessweb"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("役に立たないURLを送信する。"),

    async execute(i) {
        let web = Memer.uselessweb()
       await i.reply({ content: web });
    }
}
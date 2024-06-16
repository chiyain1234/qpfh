const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const cmdName = "somehimageswithoutnsfwchannel";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 60,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('H画像をNSFWチャンネル無しで...'),

        async execute(i, client) {
            let data = [
                { url: "https://cdn.discordapp.com/attachments/1053854175055851570/1250684274450104320/whistled.gif", text: "whistled" },
                { url: "https://cdn.discordapp.com/attachments/1053854175055851570/1250684274110238782/rickrolled.gif", text: "rickrolled" },
            ];
            
            let randomIndex = Math.floor(Math.random() * data.length);
            let randomItem = data[randomIndex];
            let randomUrl = randomItem.url;
            let randomText = randomItem.text;

            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(i.user.username + " is " + randomText)
                .setImage(randomUrl)
           await i.reply({ embeds: [Embed] });
    },
};

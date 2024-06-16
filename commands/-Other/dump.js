const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

const cmdName = "dump"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandBuilder()
        .setName(cmdName)
        .setDescription("Bump(偽)をします。"),

    async execute(i) {
        let arr = ["https://cdn.discordapp.com/attachments/1001354677226590308/1004651095244689408/bumpbump.png",
                   "https://cdn.discordapp.com/attachments/1001354677226590308/1243168370690625566/kaso.png"
        ]
        var random = Math.floor(Math.random() * arr.length);
        var result = arr[random];

        const Embed = new MessageEmbed()
            .setColor("#24b7b7")
            .setTitle(`DISBOARD: Discordサーバー掲示板`)
            .setURL("https://disboard.org/")
            .setDescription(`表示順をアップしたよ 👍\n[ディスボード](https://disboard.org/ja/server/${i.guild.id})で確認してね`)
            .setImage(result)
       await i.reply({ embeds: [Embed] });
    }
}
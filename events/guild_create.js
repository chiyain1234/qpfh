const Discord = require("discord.js");
const config = require("../config.js");

module.exports = {
    name: "guildCreate",
    async run(guild, client) {
        const Embed = new Discord.MessageEmbed()
            .setTitle("サーバー追加")
            .setDescription(`${guild.name}\n${guild.id}にBotが追加されました。`)
            .addFields(
                { name: `ユーザー数 :`, value: `${guild.memberCount}`, inline: true }, 
                { name: `総サーバー数 :`, value: `${client.guilds.cache.size}`, inline: true }, 
                { name: `総ユーザー数 :`, value: `${client.guilds.cache.map(guild => guild.memberCount).reduce((p, c) => p + c)}`, inline: true })
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor(config.color)
            .setTimestamp();
        client.channels.fetch(config.logch.guildCreate).then(c => c.send({ embeds: [Embed] }));
    }
}
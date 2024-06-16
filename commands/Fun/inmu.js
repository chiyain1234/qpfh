const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const axios = require('axios')
const cmdName = "inmu"

module.exports = {
    guildOnly: true,
    nsfwOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("ランダムに淫夢語録を送信する。"),

    async execute(i, client) {
        await i.deferReply();
        let getunis = async () => {
            let response = await axios.get(
                'https://raw.githubusercontent.com/chiyain1234/inmu56/main/810.json'
            );
            let uni = response.data;
            return uni;
        };
        let uniValues = await getunis();
        var arr = uniValues.word
        var random = Math.floor(Math.random() * arr.length);
        var result = arr[random];

        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor({name: `${client.user.tag}`,　iconURL: `${client.user.displayAvatarURL()}`,url: '' })
            .setDescription(result)
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });
        await i.editReply({ embeds: [Embed] })
    }
}
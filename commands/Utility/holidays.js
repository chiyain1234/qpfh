const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const cmdName = "holidays"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("指定した年の祝日一覧を表示する。")
        .addIntegerOption(
            option => option
            .setName("year")
            .setDescription("年を入力して下さい")
            .setRequired(false)
            .setMinValue(1974)
            .setMaxValue(2074)
        ),

    async execute(i, client) { // Function to run on call
        const yearOption = i.options.getInteger('year') || 2024
        const year = String(yearOption)
        if (yearOption) {
            const url = `https://date.nager.at/api/v2/PublicHolidays/${year}/JP`
            let getuni = async () => {
                let response = await axios.get(url);
                let uni = response.data;
                return uni;
            };
            let uniValue = await getuni();
            var holidayList = uniValue.map(holiday => `- ${holiday.date} : ${holiday.localName}, ${holiday.name}`).join('\n');
            var yearString = year
            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`${yearString}年の祝日一覧`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setDescription(holidayList)
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            await i.reply({ embeds: [Embed] });
        }
    }
}
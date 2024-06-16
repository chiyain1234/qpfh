const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('weather')
        .setDescription('指定した地域の天気情報を取得します。')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('天気を確認する地域の名前を入力してください。')
                .setRequired(true)),

    async execute(interaction, client) {
        await interaction.deferReply();

        const location = interaction.options.getString('location');
        
        weather.find({ search: location, degreeType: 'C' }, async function (err, result) {
            if (err) {
                console.log(err);
                return interaction.editReply('天気情報の取得中にエラーが発生しました。');
            }

            if (result && result.length > 0) {
                const current = result[0].current;
                const location = result[0].location;

                // 週間天気予報の取得
                const forecast = result[0].forecast;

                const embed = new MessageEmbed()
                    .setTitle(`${location.name} の現在の天気`)
                    .setDescription(`${current.skytext}`)
                    .addFields(
                        { name: '天気', value: `${current.temperature} 度`, inline: true },
                        { name: '湿度', value: `${current.humidity} %`, inline: true },
                        { name: '風', value: `${current.winddisplay}`, inline: true }
                    )
                    .addFields({name: '週間天気予報', value: getWeeklyForecast(forecast)})
                    .setThumbnail(current.imageUrl)
                    .setColor(client.config.color)
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                    .setTimestamp()
                    .setFooter({ text: interaction.toString(), iconURL: '' });

                await interaction.editReply({ embeds: [embed] });
            } else {
                interaction.editReply('その地域の天気情報が見つかりませんでした。');
            }
        });
    },
};

// 週間天気予報を整形する関数
function getWeeklyForecast(forecast) {
    let forecastString = '';
    forecast.forEach(day => {
        forecastString += `**${day.day}**: ${day.skytextday}, 最高気温 ${day.high} 度, 最低気温 ${day.low} 度\n`;
    });
    return forecastString;
}

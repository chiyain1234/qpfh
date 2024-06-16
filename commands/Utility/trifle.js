const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const translate = require("translatte");

const cmdName = "trifle";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("各種情報を選択して表示します。")
        .addStringOption(option =>
            option.setName('type')
            .setDescription('情報の種類を選択してください。')
            .setRequired(true)
            .addChoices(
                { name: 'ISS（国際宇宙ステーション）の現在位置', value: 'iss' }, 
                { name: '数字に関する豆知識', value: 'numbers' }, 
                { name: 'イギリスの二酸化炭素排出量', value: 'ukco2' }, 
                { name: 'Discordのステータス', value: 'discordstatus' }
            )
        ),

    async execute(interaction, client) {
        await interaction.deferReply();

        const type = interaction.options.getString('type');

        switch (type) {
            case 'iss':
                await getISSInfo(interaction, client);
                break;
            case 'numbers':
                await getNumberTrivia(interaction, client);
                break;
            case 'ukco2':
                await getUKCO2Info(interaction, client);
                break;
            case 'discordstatus':
                await getDiscordStatus(interaction, client);
                break;
            default:
                await interaction.editReply('Invalid type selected.');
        }
    }
};

async function getISSInfo(interaction, client) {
    const url = 'http://api.open-notify.org/iss-now.json';

    try {
        const response = await axios.get(url);
        const data = response.data;

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`ISSの位置情報`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setDescription(`\`\`\`\nTimeStamp: ${data.timestamp}\nMessage: ${data.message}\n緯度: ${data.iss_position.latitude}\n経度: ${data.iss_position.longitude}\n\`\`\``)
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching ISS data:', error);
        await interaction.editReply('情報の取得中にエラーが発生しました。後でもう一度お試しください。');
    }
}

async function getNumberTrivia(interaction, client) {
    const url = 'http://numbersapi.com/random/trivia';

    try {
        const response = await axios.get(url);
        const data = response.data;

        const translatedText = await translate(data, { from: "auto", to: "ja" });
        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`数字に関する豆知識`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setDescription(`${translatedText.text.substr(0, 2000)}`)
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching number trivia:', error);
        await interaction.editReply('情報の取得中にエラーが発生しました。後でもう一度お試しください。');
    }
}

async function getUKCO2Info(interaction, client) {
    const url_0 = 'https://api.carbonintensity.org.uk/intensity';
    const url_1 = 'https://api.carbonintensity.org.uk/intensity/factors';

    try {
        const [data_0, data_1_0] = await Promise.all([
            axios.get(url_0),
            axios.get(url_1)
        ]);

        const data_1 = JSON.parse(JSON.stringify(data_1_0.data).replace(/[\s()]/g, ''));

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`イギリスのの二酸化炭素排出量`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setDescription(`\`\`\`\n開始日時: ${data_0.data[0].from}\n終了日時: ${data_0.data[0].to}\n予想: ${data_0.data[0].intensity.forecast}\n観測: ${data_0.data[0].intensity.forecast}\n指標: ${data_0.data[0].intensity.index}\n\`\`\``)
            .addFields({ name: "バイオマス発電", value: `${data_1.data[0].Biomass}`, inline: true }, { name: "石炭", value: `${data_1.data[0].Coal}`, inline: true }, { name: "オランダから", value: `${data_1.data[0].DutchImports}`, inline: true }, { name: "フランスから", value: `${data_1.data[0].FrenchImports}`, inline: true }, { name: "ガス（複合サイクル）", value: `${data_1.data[0].GasCombinedCycle}`, inline: true }, { name: "ガス（オープンサイクル）", value: `${data_1.data[0].GasOpenCycle}`, inline: true }, { name: "水素", value: `${data_1.data[0].Hydro}`, inline: true }, { name: "アイルランドから", value: `${data_1.data[0].IrishImports}`, inline: true }, { name: "原子力発電", value: `${data_1.data[0].Nuclear}`, inline: true }, { name: "石油", value: `${data_1.data[0].Oil}`, inline: true }, { name: "その他", value: `${data_1.data[0].Other}`, inline: true }, { name: "揚水貯蔵", value: `${data_1.data[0].PumpedStorage}`, inline: true }, { name: "太陽光発電", value: `${data_1.data[0].Solar}`, inline: true }, { name: "風力発電", value: `${data_1.data[0].Wind}`, inline: true })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching UK CO2 data:', error);
        await interaction.editReply('情報の取得中にエラーが発生しました。後でもう一度お試しください。');
    }
}

async function getDiscordStatus(interaction, client) {
    const url = 'https://discordstatus.com/api/v2/status.json';
    try {
        const response = await axios.get(url);
        const data = response.data;

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`Discordのステータス`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setDescription(`\`\`\`\nID: ${data.page.id}\nTime: ${data.page.time_zone}\nDescription: ${data.status.description}\n\`\`\``)
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching Discord status data:', error);
        await interaction.editReply('情報の取得中にエラーが発生しました。後でもう一度お試しください。');
    }
}
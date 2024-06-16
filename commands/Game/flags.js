const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const axios = require('axios');

const cmdName = "flag";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("ランダムに国旗の画像を送信します。")
        .addStringOption(option => option
            .setName('shu')
            .setDescription('州を選択してください。')
            .setRequired(false)
            .addChoices(
                { name: 'アジア州', value: '1' }, 
                { name: 'ヨーロッパ州', value: '2' }, 
                { name: 'アフリカ州', value: '3' }, 
                { name: 'オセアニア州', value: '4' }, 
                { name: '北アメリカ州', value: '5' }, 
                { name: '南アメリカ州', value: '6' }, 
                { name: '全て', value: '7' }
            )),

    async execute(i, client) {
        await i.deferReply();
        const selectedRegion = i.options.getString('shu');
        let va, arr;

        const fetchFlags = async (url) => {
            const response = await axios.get(url);
            return response.data;
        };

        const regionMap = {
            "1": { name: "アジア州", key: "Asia" },
            "2": { name: "ヨーロッパ州", key: "Europe" },
            "3": { name: "アフリカ州", key: "Africa" },
            "4": { name: "オセアニア州", key: "Oceania" },
            "5": { name: "北アメリカ州", key: "North_America" },
            "6": { name: "南アメリカ州", key: "Sourth_America" },
            "7": { name: "全て", key: "All" }
        };

        if (selectedRegion === "7" || !selectedRegion) {
            va = "全て";
            const data = await fetchFlags('https://raw.githubusercontent.com/chiyain1234/worldflags/main/all.json');
            arr = data.All;
        } else {
            va = regionMap[selectedRegion].name;
            const data = await fetchFlags('https://raw.githubusercontent.com/chiyain1234/worldflags/main/Flags.json');
            arr = data[regionMap[selectedRegion].key];
        }

        const result = arr[Math.floor(Math.random() * arr.length)];
        const image = result.flag_image;

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setTitle(`この国旗は何の国？ | カテゴリ: ${va}`)
            .setImage("attachment://flags.png")
            .setTimestamp()
            .setFooter({ text: i.toString() });

        const attachment = new MessageAttachment(image, "flags.png");

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('get_country_name')
                .setLabel('国名を表示する')
                .setStyle('PRIMARY')
        );

        const message = await i.editReply({ embeds: [embed], files: [attachment], components: [row] });

        const filter = buttonInteraction => buttonInteraction.customId === 'get_country_name' && buttonInteraction.user.id === i.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 180000 });

        collector.on('collect', async (buttonInteraction) => {
            collector.stop('button_clicked');
            row.components.forEach(component => component.setDisabled(true));
            await buttonInteraction.update({ components: [row] });
            await i.followUp({ content: `答え: ||${result.country_name.Japanese}, ${result.country_name.English}||` });
        });

        collector.on('end', (collected, reason) => {
            if (reason !== 'button_clicked') {
                i.editReply({ content: `タイムアウトしました。\n答え: ||${result.country_name.Japanese}, ${result.country_name.English}||`, components: [] });
            }
        });
    }
};
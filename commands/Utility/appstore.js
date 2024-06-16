const { SlashCommandSubcommandBuilder,  } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const AppleStore = require("app-store-scraper");
const cmdName = "appstore"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("AppStoreの情報を取得する。")
        .addStringOption(option => option.setName('検索ワード')
            .setDescription('検索ワードを入力してください。')
            .setRequired(true)),

    async execute(i, client) {
        var text = i.options.getString('検索ワード');
        await i.deferReply();
        AppleStore.search({
            term: text,
            num: 1,
            lang: 'JA'
        }).then(Data => {
            let App;

            try {
                App = JSON.parse(JSON.stringify(Data[0]));
            } catch (error) {
                return i.editReply({ content: `アプリケーションが見つかりませんでした。`,  ephemeral: true });
            }

            let Description = App.description.length > 2000 ? `${App.description.substr(0, 2000)}...` : App.description
            let Price = App.free ? "無料" : `$${App.price}`;
            let Score = App.score.toFixed(1);
            let rating = App.contentRating
            let version_0 = null ? "--" : `$${App.version}`;
            let version = version_0.split("$").join('');
            let Screen = App.screenshots
            let shots = Math.floor(Math.random() * Screen.length);

            let Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setThumbnail(App.icon)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                .setURL(App.url)
                .setTitle(`${App.title}`)
                .setDescription(Description)
                .addFields({ name: `値段`, value: Price, inline: true })
                .addFields({ name: `開発者`, value: App.developer, inline: true })
                .addFields({ name: `評価`, value: Score, inline: true })
                .addFields({ name: `対象年齢`, value: rating, inline: true })
                .addFields({ name: `バージョン`, value: version, inline: true })
                .setImage(`${Screen[shots]}`)
                .setTimestamp()
                .setFooter({ text: `/${cmdName}`, iconURL: '' });
            return i.editReply({ embeds: [Embed] });
        });
    }
}
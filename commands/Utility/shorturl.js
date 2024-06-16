const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const validUrl = require('valid-url');
const turl = require('turl');

const cmdName = "shorturl";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("URLをショートURLにする。")
        .addStringOption(option => option.setName('url')
            .setDescription('URLを入力してください。')
            .setRequired(true)),
  
    async execute(i, client) {
        const url = i.options.getString('url');

        if (!validUrl.isUri(url)) {
            const errorEmbed = new MessageEmbed()
                .setTitle("エラー")
                .setDescription(`指定されたURLが無効です。\n有効なURLを入力してください。`)
                .setColor("RED");
            await i.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        let shortLink;

        try {
            if (app === "tiny") {
                shortLink = await turl.shorten(url);
            }

            const successEmbed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`短縮URLを生成しました`)
                .addFields(
                    { name: '元のURL', value: url, inline: false },
                    { name: '短縮URL', value: shortLink, inline: false },
                    { name: '使用したサービス', value: app, inline: false }
                )
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp()
                .setFooter({ text: `/${cmdName}`});

            await i.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(error);
            const errorEmbed = new MessageEmbed()
                .setTitle("エラー")
                .setDescription(`URLの短縮に失敗しました。もう一度お試しください。`)
                .setColor("RED");
            await i.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};

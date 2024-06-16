const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('emoji')
        .setDescription('指定した絵文字の情報を取得する。')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('情報を取得する絵文字の名前、ID、またはそのままの絵文字を指定してください。')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const emojiArg = interaction.options.getString('emoji');
// 絵文字を取得
        const emoji = client.emojis.cache.find(emoji => emoji.name === emojiArg || emoji.id === emojiArg || emoji.toString().includes(emojiArg));


        if (!emoji) {
            await interaction.reply("指定した絵文字が見つかりませんでした。");
            return;
        }
        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(client.config.color)
            .setTitle('絵文字情報')
            .setDescription(`絵文字: ${emoji}`)
            .addFields(
                { name: '名前', value: emoji.name, inline: true },
                { name: 'ID', value: emoji.id, inline: true },
                { name: '作成日時', value: `<t:${parseInt(emoji.createdTimestamp / 1000)}:f>`, inline: true },
                { name: 'アニメーション', value: emoji.animated ? 'はい' : 'いいえ', inline: true },
            )
            .setFooter({ text: `/emoji`, iconURL: '' })
            .setTimestamp()
            .setImage(emoji.url); // 絵文字の画像をサムネイルに設定

        await interaction.reply({ embeds: [embed] });
    }
};

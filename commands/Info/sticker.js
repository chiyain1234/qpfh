const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('sticker')
        .setDescription('指定したステッカーの情報を取得する。')
        .addStringOption(option =>
            option.setName('sticker')
                .setDescription('情報を取得するステッカーの名前またはIDを指定してください。')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const stickerArg = interaction.options.getString('sticker');
        const guild = interaction.guild;
        const sticker = guild.stickers.cache.find(sticker => 
            sticker.name === stickerArg || 
            sticker.id === stickerArg
        );

        if (!sticker) {
            await interaction.reply("指定したステッカーが見つかりませんでした。");
            return;
        }
        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(client.config.color)
            .setTitle('ステッカー情報')
            .setDescription(`ステッカー: ${sticker.name}`)
            .addFields(
                { name: '名前', value: sticker.name, inline: true },
                { name: 'ID', value: sticker.id, inline: true },
                { name: '作成日時', value: sticker.createdTimestamp ? `<t:${parseInt(sticker.createdTimestamp / 1000)}:f>` : '不明', inline: true },
                { name: 'タイプ', value: sticker.format, inline: true },
                { name: '利用可能', value: sticker.available ? 'はい' : 'いいえ', inline: true },
                { name: 'タグ', value: sticker.tags.join(', ') || 'なし', inline: true }
            )
            .setFooter({ text: `/sticker`, iconURL: '' })
            .setTimestamp()
            .setImage(`https://cdn.discordapp.com/stickers/${sticker.id}.${sticker.format.toLowerCase()}`);

        await interaction.reply({ embeds: [embed] });
    }
};

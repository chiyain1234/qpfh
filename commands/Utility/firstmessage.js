const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const cmdName = "firstmessage";

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("このチャンネル最初のメッセージを取得する。")
        .addStringOption(option => option
            .setName('embed')
            .setDescription('あなたはEmbedを必要としますか？')
            .setRequired(false)
            .addChoices({ name: 'Yes', value: 'yes' }, { name: 'No', value: 'no' })),

    async execute(i, client) {
        await i.reply({ content: 'Processing your command...', ephemeral: true });
        await i.deleteReply();

        const fetchMessages = await i.channel.messages.fetch({ after: 1, limit: 1 });
        const msg = fetchMessages.first();
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('最初のリンクへ行く')
                .setStyle('LINK')
                .setURL(msg.url)
        );

        const embedOption = i.options.getString('embed');
        if (embedOption === "yes") {
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`<#${i.channel.id}> の最初のメッセージ`)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setFooter({ text: i.toString() });

            await i.channel.send({ embeds: [embed], components: [row] });
        } else {
            await i.channel.send({ components: [row] });
        }
    }
};
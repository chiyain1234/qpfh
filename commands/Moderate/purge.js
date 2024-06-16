const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    userPerm: "MANAGE_MESSAGES",
    botPerm: "MANAGE_MESSAGES",
    data: new SlashCommandSubcommandBuilder()
        .setName("purge")
        .setDescription("指定したチャンネルのメッセージを一括削除します。（過去14日以内のみ）")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("削除するメッセージの数を指定してください（最大100）。")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('filter')
                .setDescription('削除するメッセージのフィルタリング条件を選択してください。')
                .setRequired(false)
                .addChoices(
                    { name: 'ボットのメッセージのみ', value: 'botOnly' },
                    { name: 'ユーザーのメッセージのみ', value: 'userOnly' },
                    { name: 'Embedメッセージのみ', value: 'embedOnly' },
                    { name: 'メンションを含む', value: 'mentionsOnly' }
                )),

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const amount = interaction.options.getInteger("amount");
        const filter = interaction.options.getString("filter");

        try {
            let messagesToDelete = [];
            let lastMessageId = null;

            while (messagesToDelete.length < amount) {
                const fetchOptions = { limit: Math.min(amount - messagesToDelete.length, 100) };
                if (lastMessageId) {
                    fetchOptions.before = lastMessageId;
                }

                const messages = await interaction.channel.messages.fetch(fetchOptions);
                if (messages.size === 0) break;

                if (!filter) {
                    messagesToDelete = messagesToDelete.concat(Array.from(messages.values()).slice(0, amount - messagesToDelete.length));
                } else {
                    let filteredMessages = messages;
                    if (filter === "botOnly") {
                        filteredMessages = messages.filter(message => message.author.bot);
                    } else if (filter === "userOnly") {
                        filteredMessages = messages.filter(message => !message.author.bot);
                    } else if (filter === "embedOnly") {
                        filteredMessages = messages.filter(message => message.embeds.length > 0);
                    } else if (filter === "mentionsOnly") {
                        filteredMessages = messages.filter(message => message.mentions.users.size > 0);
                    }

                    messagesToDelete = messagesToDelete.concat(Array.from(filteredMessages.values()).slice(0, amount - messagesToDelete.length));
                }

                lastMessageId = messages.last().id;
            }

            const messageIds = messagesToDelete.map(message => message.id);
            await interaction.channel.bulkDelete(messageIds, true);

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                .setDescription(`${messagesToDelete.length} 件のメッセージが削除されました。`)
                .setTimestamp();
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error("メッセージ削除中にエラーが発生しました:", error);
            await interaction.editReply("メッセージ削除中にエラーが発生しました。");
        }
    }
};

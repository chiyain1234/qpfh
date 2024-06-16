const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('bot')
        .setDescription('TanTanの情報を見る。'),

    async execute(i, client) {
        const userId = "922776570597376012";
        const user = await client.users.fetch(userId);
        const guilds = await client.guilds.fetch();

        const aggregateCount = async (filterFn) => {
            const counts = await Promise.all(guilds.map(async guildData => {
                const guild = await client.guilds.fetch(guildData.id);
                return filterFn(guild).size;
            }));
            return counts.reduce((sum, count) => sum + count, 0);
        };

        const totalRoles = await aggregateCount(guild => guild.roles.cache);
        const totalStickers = await aggregateCount(guild => guild.stickers.cache);
        const totalTextChannels = await aggregateCount(guild => guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT'));
        const totalVoiceChannels = await aggregateCount(guild => guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE'));
        const totalCategories = await aggregateCount(guild => guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY'));
        const totalAnnouncementChannels = await aggregateCount(guild => guild.channels.cache.filter(channel => channel.type === 'GUILD_NEWS'));
        const totalStageChannels = await aggregateCount(guild => guild.channels.cache.filter(channel => channel.type === 'GUILD_STAGE_VOICE'));
        const totalForumChannels = await aggregateCount(guild => guild.channels.cache.filter(channel => channel.type === 'GUILD_FORUM'));
        const boostedGuildsCount = (await Promise.all(guilds.map(async guildData => {
            const guild = await client.guilds.fetch(guildData.id);
            return guild.premiumTier > 0 ? 1 : 0;
        }))).reduce((sum, count) => sum + count, 0);

        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const activeVoiceMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.voiceStates.cache.size, 0);
        const totalServer = client.guilds.cache.size
        const totalEmoji = client.emojis.cache.size

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`**${client.user.username}**`)
            .setThumbnail(client.user.displayAvatarURL())
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription(`作成者: ${user.username}\n開発言語: Discord.Js\nスラッシュコマンド対応のボットです。娯楽メインで作成しています。\n不具合があった場合はサポートサーバーから連絡をお願いします。\n[**Bot invite link**](https://discord.com/api/oauth2/authorize?client_id=998919632566091868&permissions=1103017143414&scope=bot%20applications.commands) | [**Support server**](https://discord.gg/3WYXZWDRD7)`)
            .addFields(
                { name: "導入数: ", value: `${totalServer} servers`, inline: true },
                { name: "メンバー総数: ", value: `${totalMembers} users`, inline: true },
                { name: "チャンネル総数: ", value: `<:c_channel_text:1150352065676185691> : ${totalTextChannels},<:c_channel_voice:1150352136706719776> : ${totalVoiceChannels},<:c_thread:956849052950093854> : ${totalCategories},<:c_channel_announce:1150352233981034607> : ${totalAnnouncementChannels},<:c_channel_stage:1150352843883167835> : ${totalStageChannels},<:c_channel_forum:1150351477034983465> : ${totalForumChannels}`, inline: false },
                { name: "ブーストされているサーバー総数: ", value: `${boostedGuildsCount} boosted servers`, inline: true },
                { name: "ボイスチャット中のメンバー数: ", value: `${activeVoiceMembers} members`, inline: true },
                { name: "絵文字総数: ", value: `${totalEmoji} emojis`, inline: true },
                { name: "ロール総数: ", value: `${totalRoles} roles`, inline: true },
                { name: "ステッカー総数: ", value: `${totalStickers} stickers`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: i.toString() });

        i.reply({ embeds: [embed] });
    }
};

const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const cmdName = "server";
const { Permissions } = require('discord.js');

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('サーバーの情報を取得する。'),

    async execute(i, client) {
        const emojis = i.guild.emojis.cache
            .map((e) => `${e}`)
            .slice(0, 10)
            .join(', ') || 'なし';

        const totalTextChannels = i.guild.channels.cache.filter((r) => r.type === 'GUILD_TEXT').size;
        const totalVoiceChannels = i.guild.channels.cache.filter((r) => r.type === 'GUILD_VOICE').size;
        const totalCategories = i.guild.channels.cache.filter((r) => r.type === 'GUILD_CATEGORY').size;
        const totalAnnouncementChannels = i.guild.channels.cache.filter((r) => r.type === 'GUILD_NEWS').size;
        const totalStageChannels = i.guild.channels.cache.filter((r) => r.type === 'GUILD_STAGE_VOICE').size;
        const totalForumChannels = i.guild.channels.cache.filter((r) => r.type === 'GUILD_FORUM').size;        
        const totalStickers = i.guild.stickers.cache.size;

        const afkTimeout = i.guild.afkTimeout / 60; // AFKタイムアウトを分に変換
        const systemChannel = i.guild.systemChannel ? `<#${i.guild.systemChannel.id}>` : 'なし';
        const afkChannel = i.guild.afkChannel ? `<#${i.guild.afkChannel.id}>` : 'なし';
        const banner = i.guild.bannerURL() ? `[バナー画像](${i.guild.bannerURL()})` : 'なし';
        const splash = i.guild.splashURL() ? `[招待スプラッシュ](${i.guild.splashURL()})` : 'なし';

        const region = i.guild.region || 'なし';
        const maxBitrate = Math.max(...i.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').map(c => c.bitrate)) / 1000 + ' kbps' || 'なし';
        const preferredLocale = i.guild.preferredLocale || 'なし';
        const nsfwLevel = i.guild.nsfwLevel || 'なし';

        const Embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(client.config.color)
            .setThumbnail(i.guild.iconURL({ dynamic: true }))
            .setFooter({ text: `/${cmdName}`, iconURL: '' })
            .setTimestamp()
            .addFields(
                {
                    name: 'サーバー名:',
                    value: i.guild.name,
                    inline: false,
                },
                {
                    name: 'サーバーID:',
                    value: i.guild.id,
                    inline: false,
                },
                {
                    name: '作成日:',
                    value: `<t:${Math.floor(i.guild.createdTimestamp / 1000)}:f> | <t:${Math.floor(i.guild.createdTimestamp / 1000)}:R>`,
                    inline: false,
                },
                {
                    name: '所有者:',
                    value: `<@${i.guild.ownerId}>`,
                    inline: true,
                },
                {
                    name: `メンバー: (${i.guild.memberCount})`,
                    value: `${i.guild.premiumSubscriptionCount} ブースト :sparkles:`,
                    inline: true,
                },
                {
                    name: `チャンネル (${i.guild.channels.cache.size})`,
                    value: `**<:c_channel_text:1150352065676185691> : ${totalTextChannels}, <:c_channel_voice:1150352136706719776> : ${totalVoiceChannels}, <:c_thread:956849052950093854> : ${totalCategories}, <:c_channel_announce:1150352233981034607> : ${totalAnnouncementChannels}, <:c_channel_stage:1150352843883167835> : ${totalStageChannels}, <:c_channel_forum:1150351477034983465> : ${totalForumChannels}**`, 
                    inline: true
                },
                {
                    name: '*認証レベル',
                    value: `${i.guild.verificationLevel}`,
                    inline: true,
                },
                {
                    name: 'カウント',
                    value: `**${i.guild.roles.cache.size}** ロール | **${i.guild.emojis.cache.size}** 絵文字 | **${totalStickers}** スタンプ\n**絵文字リスト**\n${emojis}`,
                    inline: false,
                },
                {
                    name: 'システムメッセージチャンネル',
                    value: systemChannel,
                    inline: true,
                },
                {
                    name: 'AFKチャンネル',
                    value: afkChannel,
                    inline: true,
                },
                {
                    name: 'AFKタイムアウト',
                    value: `${afkTimeout} 分`,
                    inline: true,
                },
                {
                    name: 'バナー',
                    value: banner,
                    inline: true,
                },
                {
                    name: '招待スプラッシュ',
                    value: splash,
                    inline: true,
                },
                {
                    name: '地域',
                    value: region,
                    inline: true,
                },
                {
                    name: '最大ビットレート',
                    value: maxBitrate,
                    inline: true,
                },
                {
                    name: 'プライマリ言語',
                    value: preferredLocale,
                    inline: true,
                },
                {
                    name: 'NSFWレベル',
                    value: nsfwLevel,
                    inline: true,
                }
            );

        i.reply({
            embeds: [Embed],
        });
    }
};

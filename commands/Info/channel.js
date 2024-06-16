const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const permissionTranslations = {
    CREATE_INSTANT_INVITE: "招待の作成",
    KICK_MEMBERS: "メンバーのキック",
    BAN_MEMBERS: "メンバーのバン",
    ADMINISTRATOR: "管理者",
    MANAGE_CHANNELS: "チャンネル管理",
    MANAGE_GUILD: "サーバー管理",
    ADD_REACTIONS: "リアクションの追加",
    VIEW_AUDIT_LOG: "監査ログの表示",
    PRIORITY_SPEAKER: "優先スピーカー",
    STREAM: "ライブストリームの使用",
    VIEW_CHANNEL: "チャンネルの表示",
    SEND_MESSAGES: "メッセージの送信",
    SEND_TTS_MESSAGES: "TTSメッセージの送信",
    MANAGE_MESSAGES: "メッセージの管理",
    EMBED_LINKS: "リンクの埋め込み",
    ATTACH_FILES: "ファイルの添付",
    READ_MESSAGE_HISTORY: "メッセージ履歴の読み取り",
    MENTION_EVERYONE: "@everyone、@here、全メンションの使用",
    USE_EXTERNAL_EMOJIS: "外部絵文字の使用",
    VIEW_GUILD_INSIGHTS: "サーバーインサイトの表示",
    CONNECT: "接続",
    SPEAK: "発言",
    MUTE_MEMBERS: "メンバーのミュート",
    DEAFEN_MEMBERS: "メンバーのミュート解除",
    MOVE_MEMBERS: "メンバーの移動",
    USE_VAD: "音声活動の使用",
    CHANGE_NICKNAME: "ニックネームの変更",
    MANAGE_NICKNAMES: "ニックネームの管理",
    MANAGE_ROLES: "ロール管理",
    MANAGE_WEBHOOKS: "Webhookの管理",
    MANAGE_EMOJIS_AND_STICKERS: "絵文字とステッカーの管理",
    USE_APPLICATION_COMMANDS: "アプリケーションコマンドの使用",
    REQUEST_TO_SPEAK: "スピークリクエスト",
    MANAGE_EVENTS: "イベントの管理",
    MANAGE_THREADS: "スレッドの管理",
    USE_PUBLIC_THREADS: "公開スレッドの使用",
    CREATE_PUBLIC_THREADS: "公開スレッドの作成",
    USE_PRIVATE_THREADS: "非公開スレッドの使用",
    CREATE_PRIVATE_THREADS: "非公開スレッドの作成",
    USE_EXTERNAL_STICKERS: "外部ステッカーの使用",
    SEND_MESSAGES_IN_THREADS: "スレッド内のメッセージ送信",
    START_EMBEDDED_ACTIVITIES: "埋め込みアクティビティの開始",
    MODERATE_MEMBERS: "メンバーのタイムアウト",
    VIEW_CREATOR_MONETIZATION_ANALYTICS: "クリエイター収益化分析の表示",
    USE_SOUNDBOARD: "サウンドボードの使用",
    SEND_VOICE_MESSAGES: "ボイスメッセージの送信"
};

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('channel')
        .setDescription('指定したチャンネルの情報を取得する。')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('情報を取得するチャンネルを指定してください。')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel');

        if (!channel) {
            await interaction.reply("指定したチャンネルが見つかりませんでした。");
            return;
        }

        // channelタイプを日本語に変換する
        let channelType;
        switch (channel.type) {
            case 'GUILD_TEXT':
                channelType = 'テキスト';
                break;
            case 'GUILD_VOICE':
                channelType = 'ボイス';
                break;
            case 'GUILD_CATEGORY':
                channelType = 'カテゴリ';
                break;
            case 'GUILD_NEWS':
                channelType = 'ニュース';
                break;
            case 'GUILD_STORE':
                channelType = 'ストア';
                break;
            case 'GUILD_STAGE_VOICE':
                channelType = 'ステージ';
                break;
            case 'GUILD_FORUM':
                channelType = 'フォーラム';
                break;
            default:
                channelType = '不明';
                break;
        }

        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(client.config.color)
            .setTitle('チャンネル情報')
            .addFields({ name: '名前', value: `${channel.name}`, inline: true }, { name: 'メンション', value: `${channel.toString()}`, inline: true }, { name: 'ID', value: channel.id, inline: true }, { name: 'タイプ', value: channelType, inline: true }, { name: '作成日時', value: `<t:${parseInt(channel.createdTimestamp / 1000)}:f>`, inline: true }, { name: 'トピック', value: channel.topic || 'なし', inline: true }, { name: 'NSFW', value: channel.nsfw ? 'はい' : 'いいえ', inline: true }, { name: '位置', value: channel.position.toString(), inline: true }, { name: '権限同期', value: channel.permissionsLocked ? 'はい' : 'いいえ', inline: true })
            .setFooter({ text: `/channel`, iconURL: '' })
            .setTimestamp();

        // テキストチャンネル固有の情報
        if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_NEWS') {
            embed.addFields({ name: 'スローモード遅延', value: `${channel.rateLimitPerUser}秒`, inline: true }, { name: '最後のピン留め日時', value: channel.lastPinTimestamp ? `<t:${parseInt(channel.lastPinTimestamp / 1000)}:f>` : 'なし', inline: true }, { name: '固定メッセージの数', value: (await channel.messages.fetchPinned()).size.toString(), inline: true }, { name: 'Webhookの数', value: (await channel.fetchWebhooks()).size.toString(), inline: true });
        }

        // ボイスチャンネル固有の情報
        if (channel.type === 'GUILD_VOICE') {
            const membersList = channel.members.map(member => member.user.tag).join('\n') || 'なし';
            embed.addFields({ name: 'ビットレート', value: `${channel.bitrate / 1000}kbps`, inline: true }, { name: 'ユーザー上限', value: channel.userLimit === 0 ? '無制限' : channel.userLimit.toString(), inline: true }, { name: '接続中のユーザー数', value: channel.members.size.toString(), inline: true }, { name: '接続中のユーザー', value: membersList, inline: true }, { name: '地域', value: channel.rtcRegion || 'デフォルト', inline: true });
        }

        // カテゴリ情報
        if (channel.parent) {
            embed.addFields({ name: '親カテゴリ', value: `<#${channel.parent.id}>`, inline: true });
        }

        // 招待リンクの取得
        const invites = await channel.guild.invites.fetch();
        const invite = invites.find(inv => inv.channel.id === channel.id);
        if (invite) {
            embed.addFields({ name: '招待リンク', value: invite.url, inline: true }, { name: '招待リンクの有効期限', value: invite.expiresAt ? `<t:${parseInt(invite.expiresAt / 1000)}:f>` : '無期限', inline: true }, { name: '最大使用回数', value: invite.maxUses ? invite.maxUses.toString() : '無制限', inline: true });
        } else {
            embed.addFields({ name: '招待リンク', value: 'なし', inline: true });
        }

        // パーミッションオーバーライトの詳細
        const permissionOverwritesArray = Array.from(channel.permissionOverwrites.cache.values());
        if (permissionOverwritesArray.length > 0) {
            embed.addFields({
                name: '権限上書き',
                value: permissionOverwritesArray
                    .map(po => {
                        const roleOrUser = po.type === 'role' ? `<@&${po.id}>` : `<@${po.id}>`;
                        const allow = po.allow.toArray().map(perm => permissionTranslations[perm] || perm).join(', ') || 'なし';
                        const deny = po.deny.toArray().map(perm => permissionTranslations[perm] || perm).join(', ') || 'なし';
                        return `${roleOrUser}\n許可: ${allow}\n拒否: ${deny}`;
                    })
                    .join('\n\n'),
                inline: false
            });
        } else {
            embed.addFields({ name: '権限上書き', value: 'なし', inline: false });
        }

        await interaction.reply({ embeds: [embed] });
    }
};
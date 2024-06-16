const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const permissionTranslations = {
    CREATE_INSTANT_INVITE: "招待の作成",
    KICK_MEMBERS: "メンバーをキック",
    BAN_MEMBERS: "メンバーをBAN",
    ADMINISTRATOR: "管理者",
    MANAGE_CHANNELS: "チャンネル管理",
    MANAGE_GUILD: "サーバー管理",
    ADD_REACTIONS: "リアクションの追加",
    VIEW_AUDIT_LOG: "監査ログの閲覧",
    PRIORITY_SPEAKER: "優先スピーカー",
    STREAM: "ライブ配信",
    VIEW_CHANNEL: "チャンネルを見る",
    SEND_MESSAGES: "メッセージを送信",
    SEND_TTS_MESSAGES: "TTSメッセージを送信",
    MANAGE_MESSAGES: "メッセージ管理",
    EMBED_LINKS: "埋め込みリンク",
    ATTACH_FILES: "ファイルを添付",
    READ_MESSAGE_HISTORY: "メッセージ履歴を読む",
    MENTION_EVERYONE: "全員にメンション",
    USE_EXTERNAL_EMOJIS: "外部の絵文字を使用",
    VIEW_GUILD_INSIGHTS: "サーバーインサイトを表示",
    CONNECT: "接続",
    SPEAK: "発言",
    MUTE_MEMBERS: "メンバーをミュート",
    DEAFEN_MEMBERS: "メンバーのスピーカーをミュート",
    MOVE_MEMBERS: "メンバーを移動",
    USE_VAD: "音声検出を使用",
    CHANGE_NICKNAME: "ニックネームの変更",
    MANAGE_NICKNAMES: "ニックネームの管理",
    MANAGE_ROLES: "ロールの管理",
    MANAGE_WEBHOOKS: "Webhookの管理",
    MANAGE_EMOJIS_AND_STICKERS: "絵文字とステッカーの管理",
    USE_APPLICATION_COMMANDS: "アプリケーションコマンドの使用",
    REQUEST_TO_SPEAK: "発言のリクエスト",
    MANAGE_EVENTS: "イベントの管理",
    MANAGE_THREADS: "スレッドの管理",
    USE_PUBLIC_THREADS: "パブリックスレッドの使用",
    CREATE_PUBLIC_THREADS: "パブリックスレッドの作成",
    USE_PRIVATE_THREADS: "プライベートスレッドの使用",
    CREATE_PRIVATE_THREADS: "プライベートスレッドの作成",
    USE_EXTERNAL_STICKERS: "外部ステッカーの使用",
    SEND_MESSAGES_IN_THREADS: "スレッドでのメッセージ送信",
    START_EMBEDDED_ACTIVITIES: "埋め込みアクティビティの開始",
    MODERATE_MEMBERS: "メンバーのモデレート",
    VIEW_CREATOR_MONETIZATION_ANALYTICS: "クリエイターモネタイズ分析を表示",
    USE_SOUNDBOARD: "サウンドボードの使用",
    SEND_VOICE_MESSAGES: "ボイスメッセージの送信"
};

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('role')
        .setDescription('指定したロールの情報を取得する。')
        .addRoleOption(option => 
            option.setName('role')
            .setDescription('情報を取得するロールを指定してください。')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const role = interaction.options.getRole('role');

        if (!role) {
            await interaction.reply("指定したロールが見つかりませんでした。");
            return;
        }

        const permissions = role.permissions.toArray()
            .map(perm => permissionTranslations[perm] || perm)
            .join('\n') || 'なし';

        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(client.config.color)
            .setTitle('ロール情報')
            .addFields(
                { name: '名前', value: role.name, inline: true },
                { name: 'ID', value: role.id, inline: true },
                { name: '色', value: role.hexColor.toUpperCase(), inline: true },
                { name: '作成日時', value: `<t:${parseInt(role.createdTimestamp / 1000)}:f>`, inline: true },
                { name: 'メンバー数', value: role.members.size.toString(), inline: true },
                { name: '表示順', value: role.position.toString(), inline: true },
                { name: '権限', value: permissions, inline: name }
            )
            .setFooter({ text: `/role`, iconURL: '' })
            .setTimestamp();

        // メンション可能かどうかを確認してフィールドを追加
        if (role.mentionable) {
            embed.addFields({name: 'メンション', value: '可能', inline: true});
        } else {
            embed.addFields({name: 'メンション',value: '不可', inline: true});
        }

        await interaction.reply({ embeds: [embed] });
    }
};

const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const permissionTranslations = {
    ADMINISTRATOR: "管理者",
    VIEW_AUDIT_LOG: "監査ログの表示",
    VIEW_GUILD_INSIGHTS: "サーバーインサイトの表示",
    MANAGE_GUILD: "サーバー管理",
    MANAGE_ROLES: "ロール管理",
    MANAGE_CHANNELS: "チャンネル管理",
    KICK_MEMBERS: "メンバーのキック",
    BAN_MEMBERS: "メンバーのバン",
    CREATE_INSTANT_INVITE: "招待の作成",
    CHANGE_NICKNAME: "ニックネームの変更",
    MANAGE_NICKNAMES: "ニックネームの管理",
    MANAGE_EMOJIS_AND_STICKERS: "絵文字とステッカーの管理",
    MANAGE_WEBHOOKS: "Webhookの管理",
    VIEW_CHANNEL: "チャンネルの表示",
    SEND_MESSAGES: "メッセージの送信",
    SEND_TTS_MESSAGES: "TTSメッセージの送信",
    MANAGE_MESSAGES: "メッセージの管理",
    EMBED_LINKS: "リンクの埋め込み",
    ATTACH_FILES: "ファイルの添付",
    READ_MESSAGE_HISTORY: "メッセージ履歴の読み取り",
    MENTION_EVERYONE: "@everyone、@here、全メンションの使用",
    USE_EXTERNAL_EMOJIS: "外部絵文字の使用",
    CONNECT: "接続",
    SPEAK: "発言",
    MUTE_MEMBERS: "メンバーのミュート",
    DEAFEN_MEMBERS: "メンバーのミュート解除",
    MOVE_MEMBERS: "メンバーの移動",
    USE_VAD: "音声活動の使用",
    PRIORITY_SPEAKER: "優先スピーカー",
    STREAM: "ライブストリームの使用",
    ADD_REACTIONS: "リアクションの追加",
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
        .setName('permission')
        .setDescription('指定したユーザーの権限を取得する。')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('情報を取得するユーザーを指定してください。')
            .setRequired(false)
        ),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            await interaction.reply("指定したユーザーが見つかりませんでした。");
            return;
        }

        // 権限を日本語に変換
        const permissions = member.permissions.toArray().map(permission => permissionTranslations[permission] || permission).join('\n') || 'なし';

        const avatar = user.displayAvatarURL({ size: 1024 });
        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(client.config.color)
            .setThumbnail(avatar)
            .setTitle('ユーザーの権限情報')
            .addFields(
                { name: 'ユーザー', value: user.username, inline: true },
                { name: 'ユーザーID', value: user.id, inline: true },
            )
            .setFooter({ text: `${permissions}\n\n${interaction.toString()}`, iconURL: '' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

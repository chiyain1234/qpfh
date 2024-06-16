const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

const flagsEmojis = {
    STAFF: "<:c_b_certified:1147732914319134781>",
    PARTNERED_SERVER_OWNER: "<:c_b_partner:1147732715727237159>",
    HYPESQUAD: "<:c_b_hypesquad4:1147743863629434921>",
    BUGHUNTER_LEVEL_1: "<:c_b_bug:1147732044596650014>",
    BUGHUNTER_LEVEL_2: "<:c_b_bug_gold:1147732576753168415>",
    HOUSE_BRAVERY: "<:c_b_hupesquad2:1147733435910197329>",
    HOUSE_BRILLIANCE: "<:c_b_hypesquad3:1147733493481230348>",
    HOUSE_BALANCE: "<:c_b_hypesquad1:1147733297326215238>",
    EARLY_SUPPORTER: "<:c_b_support:1147733042304143513>",
    VERIFIED_BOT: "<:c_bot_b:1147666029196095588><:c_bot_c:1147666011475157092>",
    VERIFIED_DEVELOPER: "<:c_b_dev:1147732830558896259>",
    CERTIFIED_MODERATOR: "<:c_b_mod:1147732984552767538>",
    ACTIVE_DEVELOPER: "<:c_b_activedev:1147732770135740446>"
};

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('user')
        .setDescription('指定したユーザーの情報を取得する。')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('ユーザーを選択してください。')
                .setRequired(false)
        ),

    async execute(i, client) {
        const user = i.options.getMember('user') || i.member;
        const avatar = user.displayAvatarURL({ dynamic: true, size: 2048 });
        const roles = user.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => `<@&${role.id}>`)
            .join(', ');

        const isBot = user.user.bot ? 'ボット' : 'ユーザー';

        // ユーザーフラグと追加のバッジ情報を取得
        const userFlags = user.user.flags.toArray();
        const userBadges = userFlags.map(flag => flagsEmojis[flag]).join(' ') || 'なし';

        // ニトロステータスをチェック
        let nitroBadge = '';
        if (user.premiumSince) nitroBadge += flagsEmojis.BOOSTER;
        if (user.user.avatar && user.user.avatar.startsWith('a_')) nitroBadge += flagsEmojis.NITRO;

        // バッジを結合
        const badges = `${userBadges} ${nitroBadge}`.trim() || 'なし';

        const row1 = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.com/users/${user.user.id}`)
                .setLabel('Profile Link')
        );

        const embed1 = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setThumbnail(avatar)
            .setColor(client.config.color)
            .addFields(
                { name: "ユーザーネーム", value: `${user.user.username}`, inline: true },
                { name: "ユーザーID", value: `${user.user.id}`, inline: true },
                { name: "アカウントタイプ", value: `${isBot}`, inline: true },
                { name: "アカウント作成日", value: `<t:${parseInt(user.user.createdAt / 1000)}:f>`, inline: true },
                { name: "サーバー参加日", value: `<t:${parseInt(user.joinedAt / 1000)}:f>`, inline: true },
                { name: "バッジ", value: badges, inline: false },
                { name: "ロール", value: roles.length > 0 ? roles : 'なし', inline: false }
            )
            .setFooter({ text: `/user`, iconURL: '' })
            .setTimestamp();

        await i.reply({ embeds: [embed1], components: [row1] });
    }
};

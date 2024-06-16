const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandBuilder()
        .setName("_help")
        .setDescription("コマンドリストを表示する。")
        .addStringOption(option =>
            option.setName('command')
                .setDescription('検索したいコマンド名を入力してください。')
                .setRequired(false)
        ),

    async execute(i, client) {
        const searchQuery = i.options.getString('command');

        if (searchQuery) {
            const command = client.application.commands.cache.find(cmd => {
                if (cmd.name === searchQuery) return true;
                if (cmd.options) {
                    return cmd.options.some(opt => opt.name === searchQuery);
                }
                return false;
            });

            if (!command) {
                await i.reply({ content: `コマンド "${searchQuery}" は見つかりませんでした。`, ephemeral: true });
                return;
            }

            const subCommands = command.options ? command.options.map(option => ({
                label: option.name,
                description: option.description,
                value: option.name
            })).sort((a, b) => a.label.localeCompare(b.label)): [];

            const commandEmbed = new MessageEmbed()
                .setTitle(`コマンド: ${command.name}`)
                .setDescription(command.description || '詳細な説明はありません。')
                .addFields(
                    { name: "使用方法", value: `\`/${command.name}\``, inline: true },
                    { name: "サブコマンド", value: subCommands.length ? subCommands.map(sc => `**${sc.label}**: ${sc.description}`).join('\n') : 'なし', inline: false }
                )
                .setColor(client.config.color)
                .setTimestamp()
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setFooter({ text: i.user.tag, iconURL: i.user.displayAvatarURL() });

            await i.reply({ embeds: [commandEmbed] });
            return;
        }

        const menuOptions = [
            { label: "1. サーバー管理", value: "mod", emoji: "<:mod:1250668576193380444>", description: "1ページ目: サーバー管理コマンド一覧" },
            { label: "2. 情報", value: "info", emoji: "<:info:1250668577921433650>", description: "2ページ目: 情報コマンド一覧" },
            { label: "3. テキスト", value: "textmod", emoji: "<:text:1250668579481845782>", description: "3ページ目: テキストコマンド一覧" },
            { label: "4. 実用", value: "utility", emoji: "<:utility:1250668580878680065>", description: "4ページ目: 実用的なコマンド一覧" },
            { label: "5. アニメ", value: "animeimage", emoji: "<:anime:1250668584502431765>", description: "5ページ目: アニメ画像コマンド一覧" },
            { label: "6. 動物", value: "animal", emoji: "<:animal:1250668586364833792>", description: "6ページ目: 動物コマンド一覧" },
            { label: "7. 画像作成", value: "generate", emoji: "<:generate:1250668588294078515>", description: "7ページ目: 画像作成コマンド一覧" },
            { label: "8. フィルター", value: "imgfilter", emoji: "<:imgfilter:1250668590051622962>", description: "8ページ目: フィルターコマンド一覧" },
            { label: "9. オーバーレイ", value: "imgoverlay", emoji: "<:imgoverlay:1250668591821492334>", description: "9ページ目: オーバーレイコマンド一覧" },
            { label: "10. 数学", value: "math", emoji: "<:math:1250668670586454076>", description: "10ページ目: 数学コマンド一覧" },
            { label: "11. ゲーム", value: "game", emoji: "<:game:1250668595411685487>", description: "11ページ目: ゲームコマンド一覧" },
            { label: "12. 娯楽", value: "fun", emoji: "<:fun:1250668600004706395>", description: "12ページ目: 娯楽コマンド一覧" },
        ];

        const operationOptions = [
            { label: "ホームに戻る", value: "home", emoji: "<:home:1078192078506426538>" },
            { label: "メニューをピン止め", value: "kote", emoji: "<:pin:1078194737804222534>" },
            { label: "メニューを削除", value: "delete", emoji: "<:delete:1078194420526096404>" },
            { label: "メニューをロック", value: "lock", emoji: "<:lock:1078192182894276669>" },
            { label: "メニューをアンロック", value: "unlock", emoji: "<:unlock:1078194660654198899>" },
            { label: "ボットの招待リンク", value: "botlink", emoji: "<:link:1078195575729692682>" },
            { label: "サポートサーバーの招待リンク", value: "support", emoji: "<:server:1078195612941557850>" },
            { label: "利用規約", value: "kiyaku", emoji: "<:kiyaku:1078198310994718770>" }
        ];

        const createMenu = (customId, placeholder, options, disabled = false) => new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(customId)
                    .setPlaceholder(placeholder)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setDisabled(disabled)
                    .addOptions(options)
            );

        const helpMenu = createMenu("commandlist", 'Command List', menuOptions);
        const cmdinfo = createMenu("cmdinfo", 'Command Usage', [{ label: "...", value: "test" }], true);
        const helps = createMenu("operation", 'Operation', operationOptions);

        let totalCommands = 0;
        client.application.commands.cache.forEach(command => {
            totalCommands++; // メインコマンドをカウント
            if (command.options) {
                totalCommands += countSubCommands(command.options);
            }
        });

        const helpEmbed = new MessageEmbed()
            .setTitle('ヘルプメニュー')
            .setDescription('オプションを選択してください。')
            .addFields(
                { name: "**Command List**", value: `コマンドのカテゴリーを表示する。`, inline: false },
                { name: "**Command Usage**", value: `コマンドの使用方法を表示する。`, inline: false },
                { name: "**Operation**", value: `ヘルプメニューの操作を行う。`, inline: false },
                { name: "**Command Count**", value: `${totalCommands} commands`, inline: false }
            )
            .setColor(client.config.color)
            .setImage("https://cdn.discordapp.com/attachments/1001354677226590308/1246227578298040340/standard.gif")
            .setTimestamp()
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setFooter({ text: i.toString(), iconURL: '' });

        await i.reply({ embeds: [helpEmbed], components: [helpMenu, cmdinfo, helps] });
    }
};

function countSubCommands(options) {
    let count = 0;
    options.forEach(option => {
        if (option.type === 'SUB_COMMAND' || option.type === 'SUB_COMMAND_GROUP') {
            count++;
            if (option.options) {
                count += countSubCommands(option.options);
            }
        }
    });
    return count;
}

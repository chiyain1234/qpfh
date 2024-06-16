const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const client = require('../../index.js');

const categories = [
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

const helpMenu = new MessageActionRow()
.addComponents(
    new MessageSelectMenu()
        .setCustomId("commandlist")
        .setPlaceholder('Command List')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(categories)
);

const operations = [
    { label: "ホームに戻る", value: "home", emoji: "<:home:1078192078506426538>" },
    { label: "メニューをピン止め", value: "kote", emoji: "<:pin:1078194737804222534>" },
    { label: "メニューを削除", value: "delete", emoji: "<:delete:1078194420526096404>" },
    { label: "メニューをロック", value: "lock", emoji: "<:lock:1078192182894276669>" },
    { label: "メニューをアンロック", value: "unlock", emoji: "<:unlock:1078194660654198899>" },
    { label: "ボットの招待リンク", value: "botlink", emoji: "<:link:1078195575729692682>" },
    { label: "サポートサーバーの招待リンク", value: "support", emoji: "<:server:1078195612941557850>" },
    { label: "利用規約", value: "kiyaku", emoji: "<:kiyaku:1078198310994718770>" }
];

const helps = new MessageActionRow().addComponents(
    new MessageSelectMenu()
        .setCustomId("operation")
        .setPlaceholder('Operation')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(operations)
);

client.on("interactionCreate", async (i) => {
    if (!i.customId) return;

    if (i.customId.endsWith("Cmd")) {
        await i.deferUpdate();

        const category = i.customId.replace("Cmd", "");
        const Command = client.application.commands.cache.find(cmd => cmd.name === category);
        const cmd = Command.options.find(opt => opt.name === i.values[0]);
        
        if (!cmd) {
            return await i.reply({ content: 'Error: Subcommand not found.', ephemeral: true });
        }

        const msg = await i.channel.messages.fetch(i.message.id);
        const embedAuthor = msg.embeds[0]?.author || {};
        const embedFooter = msg.embeds[0]?.footer || {};
        const SubCommands = Command.options.map(option => ({
            label: option.name,
            description: option.description,
            value: option.name
        })).sort((a, b) => a.label.localeCompare(b.label)) || [];

        const cmdinfo = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`${category}Cmd`)
                .setPlaceholder('Command Usage')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(SubCommands)
        );

        // サブコマンドのオプションをアルファベット順にソート
        const sortedOptions = cmd.options ? [...cmd.options].sort((a, b) => a.name.localeCompare(b.name)) : [];

        // オプションの説明を作成
        const optionDescriptions = sortedOptions.length > 0 ? sortedOptions.map(opt => {
            if (opt.choices) {
                const choices = opt.choices.map(choice => choice.name).join(', ');
                return `${opt.name}: [${choices}]`;
            }
            return opt.name;
        }).join('\n') : 'None';

        const embed = new MessageEmbed()
            .setColor(msg.embeds[0].color)
            .setTitle(`${category} コマンド`)
            .setDescription(`\`\`\`\n${cmd.name}\n\`\`\``)
            .addFields(
                { name: "Info", value: cmd.description, inline: true },
                { name: "Usage", value: `\`\`\`\n/${category} ${cmd.name}\n\`\`\``, inline: true },
                { name: "Command", value: `</${category} ${cmd.name}:${Command.id}>`, inline: true },
                { name: "Options", value: optionDescriptions, inline: true }
            )
            .setTimestamp()
            .setAuthor({ name: embedAuthor.name || "", iconURL: embedAuthor.iconURL, url: '' })
            .setFooter({ text: embedFooter.text || "", iconURL: '' });

        await msg.edit({ embeds: [embed], components: [helpMenu, cmdinfo, helps] });
    }
});


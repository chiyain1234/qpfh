const client = require('../../index.js');
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isSelectMenu()) return;

    const { customId, values } = interaction;

    if (customId === "commandlist") {
        const commandCategories = [
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

        const helpMenu = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("commandlist")
                .setPlaceholder('Command List')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(commandCategories)
        );

        const helps = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("operation")
                .setPlaceholder('Operation')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(operations)
        );

        const msg = await interaction.channel.messages.fetch(interaction.message.id);

        const handleCommandSelection = async (category) => {
            const Command = client.application.commands.cache.find(cmd => cmd.name === category);
            if (!Command) {
                return await interaction.reply({ content: 'Error: Command not found.', ephemeral: true });
            }

            // サブコマンドをアルファベット順にソート
            const SubCommands = Command.options?.map(option => ({
                label: option.name,
                description: option.description,
                value: option.name
            })).sort((a, b) => a.label.localeCompare(b.label)) || [];

            const subCommandsList = SubCommands.map(subCommand => `**${subCommand.label}**: ${subCommand.description}`).join("\n");

            const Embed = new MessageEmbed()
                .setColor(msg.embeds[0].color)
                .setTitle(`/${category}`)
                .setDescription(subCommandsList)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL(), url: '' })
                .setFooter({ text: `${commandCategories.find(cmd => cmd.value === category).label.split('. ')[0]}/13: ${commandCategories.find(cmd => cmd.value === category).description.split(':')[1].trim()}`, iconURL: '' })
                .setTimestamp();

            const cmdinfo = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`${category}Cmd`)
                    .setPlaceholder('Command Usage')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(SubCommands)
            );

            await interaction.deferUpdate();
            await msg.edit({ embeds: [Embed], components: [helpMenu, cmdinfo, helps] });
        };

        switch (values[0]) {
            case "mod":
            case "info":
            case "textmod":
            case "utility":
            case "music":
            case "animeimage":
            case "animal":
            case "generate":
            case "imgfilter":
            case "imgoverlay":
            case "math":
            case "fun":
            case "game":
                await handleCommandSelection(values[0]);
                break;
        }
    }
});

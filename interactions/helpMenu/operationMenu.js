const client = require('../../index.js')
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');

client.on("interactionCreate", async (i) => {
  if (!i.customId) return;
    if (i.customId === "operation") {
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

        const helpMenu = createMenu("commandlist", 'Command List', commandCategories);
        const cmdinfo = createMenu("cmdinfo", 'Command Usage', [{ label: "...", value: "test" }], true);
        const helps = createMenu("operation", 'Operation', operations);

        let msg = await i.channel.messages.fetch(i.message.id)

        if (i.values[0] === "home") {
            await i.deferUpdate()

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
                .setColor(msg.embeds[0].color)
                .setImage("https://cdn.discordapp.com/attachments/1001354677226590308/1246227578298040340/standard.gif")
                .setTimestamp()
                .setAuthor({ name: msg.embeds[0].author.name || "", iconURL: msg.embeds[0].author.iconURL, url: '' })
                .setFooter({ text: "/_help", iconURL: '' });

            await msg.edit({ embeds: [helpEmbed], components: [helpMenu, cmdinfo, helps] });
        } else if (i.values[0] === "kote") {
            await i.deferUpdate()

            await msg.edit({ components: [] });
        } else if (i.values[0] === "delete") {
            await i.deferUpdate()

            await i.message.delete(); // :)

        } else if (i.values[0] === "lock") {
            await i.deferUpdate()


            await msg.edit({ components: [helps] });

        } else if (i.values[0] === "unlock") {
            await i.deferUpdate()


            await msg.edit({ components: [helpMenu, cmdinfo, helps] });

        } else if (i.values[0] === "botlink") {
            await i.deferUpdate()
            let helpEmbed = new MessageEmbed()
                .setTitle('ボット招待リンク')
                .setDescription('リンクを選択してください。')
                .addFields(
                    { name: "**権限なし**", value: `[Link](https://discord.com/api/oauth2/authorize?client_id=998919632566091868&permissions=0&scope=bot%20applications.commands)`, inline: true },
                    { name: "**管理者権限**", value: `[Link](https://discord.com/api/oauth2/authorize?client_id=998919632566091868&permissions=8&scope=bot%20applications.commands)`, inline: true },
                    { name: "**通常権限**", value: `[Link](https://discord.com/api/oauth2/authorize?client_id=998919632566091868&permissions=1103017143414&scope=bot%20applications.commands)`, inline: true }
                )
                .setColor(msg.embeds[0].color)
                .setTimestamp()
                .setAuthor({ name: msg.embeds[0].author.name || "", iconURL: msg.embeds[0].author.iconURL, url: '' })
                .setFooter({ text: "/_help", iconURL: '' });

            await msg.edit({ embeds: [helpEmbed] });

        } else if (i.values[0] === "support") {
            await i.deferUpdate()
            let helpEmbed = new MessageEmbed()
                .setTitle('サポートサーバーリンク')
                .setDescription('https://discord.gg/3WYXZWDRD7')
                .setColor(msg.embeds[0].color)
                .setTimestamp()
                .setAuthor({ name: msg.embeds[0].author.name || "", iconURL: msg.embeds[0].author.iconURL, url: '' })
                .setFooter({ text: "/_help", iconURL: '' });

            await msg.edit({ embeds: [helpEmbed] });

        } else if (i.values[0] === "kiyaku") {
            await i.deferUpdate()
            let helpEmbed = new MessageEmbed()
                .setTitle('このボットの利用規約')
                .setDescription('この利用規約は，CHIYAINがこのボットのサービスの利用条件を定めるものです。ご利用ユーザーの皆さまには，本規約に従って，本サービスをご利用いただきます。')
                .addFields(
                    { name: "**第1条（適用）**", value: `1. 本規約は，ユーザーと当サービスとの間の本サービスの利用に関わる一切の関係に適用されるものとします。\n2. 当サービスは本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定めをすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。\n3. 本規約の規定が前条の個別規定の規定と矛盾する場合には，個別規定において特段の定めなき限り，個別規定の規定が優先されるものとします。`, inline: false },
                    { name: "**第2条（利用登録）**", value: `1. 本サービスにおいては，登録希望者が本規約に同意の上，当サービスの定める方法によって利用登録を申請し，当サービスがこれを承認することによって，利用登録が完了するものとします。\n2. 当botは，利用登録の申請者に以下の事由があると判断した場合，利用登録の申請を承認しないことがあり，その理由については一切の開示義務を負わないものとします。\n  ・利用登録の申請に際して虚偽の事項を届け出た場合\n  ・本規約に違反したことがある者からの申請である場合\n  ・その他，当サービスが利用登録を相当でないと判断した場合`, inline: false },
                    { name: "**第3条（禁止事項）**", value: `ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。\n  ・法令または公序良俗に違反する行為\n  ・犯罪行為に関連する行為\n  ・本サービスの内容等，本サービスに含まれる著作権，商標権ほか知的財産権を侵害する行為\n  ・当サービス，ほかのユーザー，またはその他第三者のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為\n・  本サービスによって得られた情報を商業的に利用する行為\n  ・当サービスのサービスの運営を妨害するおそれのある行為\n  ・不正アクセスをし，またはこれを試みる行為\n  ・他のユーザーに関する個人情報等を収集または蓄積する行為\n  ・不正な目的を持って本サービスを利用する行為\n  ・本サービスの他のユーザーまたはその他の第三者に不利益，損害，不快感を与える行為\n  ・他のユーザーに成りすます行為\n  ・当サービスが許諾しない本サービス上での宣伝，広告，勧誘，または営業行為\n  ・面識のない異性との出会いを目的とした行為\n  ・当サービスのサービスに関連して，反社会的勢力に対して直接または間接に利益を供与する行為\n  ・その他，当サービスが不適切と判断する行為`, inline: false },
                    { name: "**第4条（本サービスの提供の停止等）**", value: `1. 当サービスは，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。\n  ・本サービスにかかるコンピュータシステムの保守点検または更新を行う場合\n  ・地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合\n  ・コンピュータまたは通信回線等が事故により停止した場合\n  ・その他，当サービスが本サービスの提供が困難と判断した場合\n2. 当サービスは，本サービスの提供の停止または中断により，ユーザーまたは第三者が被ったいかなる不利益または損害についても，一切の責任を負わないものとします。`, inline: false },
                    { name: "**第5条（利用規約の変更）**", value: `1. 当サービスは以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。\n  ・本規約の変更がユーザーの一般の利益に適合するとき。\n  ・本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。\n2. 当サービスはユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。`, inline: false }
                )
                .setColor(msg.embeds[0].color)
                .setTimestamp()
                .setAuthor({ name: msg.embeds[0].author.name || "", iconURL: msg.embeds[0].author.iconURL, url: '' })
                .setFooter({ text: "/_help", iconURL: '' });

            await msg.edit({ embeds: [helpEmbed] });

        }
    }
})

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
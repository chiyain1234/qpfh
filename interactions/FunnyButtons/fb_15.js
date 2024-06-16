const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_15") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "Hololiveボタン"
    const buttonmessage = "Hololive"
    const buttonId = "fb_15"
    const count = "46"

    const userCooldowned = await earnCashCommandCooldown.getUser(`${i.guild.id}_${i.user.id}`);

    if (userCooldowned) {
        const timeLeft = msToMinutes(userCooldowned.msLeft, false);

        const TimeEmbed = new MessageEmbed()
            .setColor(config.color)
            .setTitle(`${i.user.tag}のクールダウン`)
            .setDescription("クールダウン中です。\n```" + timeLeft.hours + ' 時間 ' + timeLeft.minutes + ' 分 ' + timeLeft.seconds + ' 秒' + "```\n後にまた実行してください。")
            .setTimestamp();

        await i.reply({ embeds: [TimeEmbed], ephemeral: true });
    } else {
        await earnCashCommandCooldown.addUser(`${i.guild.id}_${i.user.id}`);

        const tasks = [
            "3いいねで1週間毎朝「(๑╹ᆺ╹)ぬんぬん」とおはツイする",
            "3RTで2週間プロフィールに「自称高性能」と書く",
            "6RTで「レモンの30%がみんなの体内に入ってきて、それからカレーライスの22.5%の香辛料がみんなの喉を破壊してしまうから」と発言する",
            "5いいねで麦ジュースを飲む(麦茶でも許そう)",
            "3いいねで1週間毎朝「はあちゃまっちゃま〜」とおはツイする",
            "4RTで「ここんがこんこんこん！全VTuber１超絶可愛いきつねは誰だ！？ここんがこんこんこん！フブちゃん！！！」と発言する",
            "「まつりちゃんは清楚！異論は認める！」と発言しよう",
            "1いいねで1週間一人称を「あてぃし」にする",
            "2いいねで1週間名前の後ろに「＠ハバ卒」とつける",
            "3いいねで2週間名前の後ろに「＠約1500歳」とつける",
            "10RTで「\tGood evening!My Cute students.ちょっこーん！」とボイメで投稿",
            "7RTで「𓏸𓏸(自分の名前)だって、女の子なんスよ」と発言",
            "2いいねで1週間毎朝「こんあずき〜」と発言する",
            "2いいねで1週間毎朝「おはみょーん！」と発言する",
            "3RTで2週間語尾に「にぇ」をつける",
            "下手でもいいから4いいねでおかにゃんを描いて公開",
            "3RTで「ハー→ゲン↓ダッツ↑」とボイメで発言",
            "25RTで「Stellar stellar」をスペースで歌う",
            "5いいねで2週間語尾に「ぺこ」をつける",
            "3いいねで1週間毎朝「こんぬいー！」とおはツイをする",
            "15いいねで2週間一人称を「団長」にする",
            "2いいねで1週間毎朝「Ahoy！」とおはツイする",
            "50いいねでマリ箱をスペースで歌う",
            "5RTで2週間名前の後ろに「＠握力50キロ」とつける",
            "1いいねで「TE〇GA買ってこい！」と発言する。 はずれ^^",
            "5RTで「ういびーむ！」をスペースかボイメで全力でやる",
            "2いいねで1週間毎朝「こんばんドドドー！」とおはツイする",
            "4RTで2週間名前の後ろに「＠TMT」をつける",
            "1いいねで1週間毎朝「おはやっぴー！」とおはツイする",
            "4いいねで2週間語尾に「なのら」をつける",
            "2いいねで1週間毎朝「おはらみです！」とおはツイする",
            "問答無用で「わたしはラミィ？　いやいやいやいや俺ラミィ！　おーれーが、ラミィ！」とツイートしよう",
            "3RTでボイメで「こんねねー！」と叫んで発言しよう",
            "5RTで「YAGOOのﾁｿﾁｿもフラフラフライデーしている」と発言",
            "10RTで1週間名前の後ろに「＠魂がセンシティブ」とつけよう",
            "3RTで「ららーいおん♪ららーいおん♪」ボイメで歌って発言しよう",
            "5いいねで2週間語尾に「ぺこ」をつける",
            "2いいねで1週間お風呂禁止",
            "1いいねで1週間語尾に「ござる」をつけよう",
            "10RTでセミのモノマネをボイメで発言しよう",
            "3いいねで1週間語尾に「しゅば」をつけよう",
        ];

        const randomIndex = Math.floor(Math.random() * tasks.length);
        const result = tasks[randomIndex];

        const msgs = await i.channel.messages.fetch(i.message.id);

        msgs.embeds.forEach(async (lembed) => {
            const value = lembed.footer.text;
            if (value !== "0") {
                const Embed = new MessageEmbed()
                    .setColor(config.color)
                    .setTitle(buttonName)
                    .setDescription(`${i.user.username}: \n${result}`)
                    .setThumbnail(`${i.user.displayAvatarURL()}`)
                    .setTimestamp();
                i.reply({ content: i.user.toString(), embeds: [Embed] });

                const msg = await i.fetchReply();
                msg.react("🔁");
                msg.react("❤️");

                const val = value - 1;

                const fEmbed = new MessageEmbed()
                    .setColor(config.color)
                    .setTitle(buttonName)
                    .setDescription(`結果パターン: ${count} 通り`)
                    .setTimestamp()
                    .setFooter({ text: `${val}`, iconURL: '' });

                const button = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(buttonId)
                            .setLabel(buttonmessage)
                            .setStyle(`PRIMARY`),
                    );

                msgs.edit({ embeds: [fEmbed], components: [button] });

                if (value === "1") {
                    const finalEmbed = new MessageEmbed()
                        .setColor(config.color)
                        .setTitle(buttonName)
                        .setDescription(`結果パターン: ${count} 通り`)
                        .setTimestamp()
                        .setFooter({ text: `回数制限に達しました。`, iconURL: '' });

                    const disabledButton = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(buttonId)
                                .setLabel(buttonmessage)
                                .setDisabled(true)
                                .setStyle(`PRIMARY`),
                        );

                    msgs.edit({ embeds: [finalEmbed], components: [disabledButton] });
                }
            }
        });
    }
}
});
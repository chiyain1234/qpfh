const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
    if (i.customId === "fb_06") {
        const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

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
                "1いいねで顔を晒す\r\n\r\nそこのお前もこのボタンを押せ",
                "3いいねで1ヵ月猫化\r\n\r\nそこのお前もこのボタンを押せ",
                "5いいねで『君を初めて見てから好きになったのでぜひ私と付き合ってください！』とボイスで投稿\r\n\r\nそこのお前もこのボタンを押せ",
                "4いいねでリプをくれた人のお願いを絶対に聞く\r\n\r\nそこのお前もこのボタンを押せ",
                "10いいねでボイス投稿\r\n(リプできたやつを全部やる)\r\n\r\nそこのお前もこのボタンを押せ",
                "3いいねで1ヵ月ロリ化\r\n(男はショタ化)\r\n\r\nそこのお前もこのボタンを押せ",
                "2いいねで誰かに告白(DMで)もちろん証拠を見せろ\r\n\r\nそこのお前もこのボタンを押せ",
                "4いいねで自分の性癖と性別を言う\r\n\r\nそこのお前もこのボタンを押せ",
                "6いいねでみんなの言うことを絶対にやる(1ヵ月ずっと)\r\n\r\nそこのお前もこのボタンを押せ",
                "100いいね来るまで浮上禁止\r\n\r\nそこのお前もこのボタンを押せ",
                "100rtと100いいね来るまで浮上禁止\r\n\r\nそこのお前もこのボタンを押せ",
                "1rtで黒歴史を5つ暴露\r\n\r\nそこのお前もこのボタンを押せ",
                "3分で15rt達成できなければ3時間浮上禁止\r\n\r\nそこのお前もこのボタンを押せ",
                "2rtで自分の全身像を写す\r\nそして投稿する(絶対)\r\n\r\nそこのお前もこのボタンを押せ",
                "5rtで自分の部屋を公開\r\n\r\nそこのお前もこのボタンを押せ",
                "2rtで自分の好きなものと嫌いなものを言う\r\n\r\nそこのお前もこのボタンを押せ",
                "3週間以内に200rtと150いいね来なければTwitter引退\r\n\r\nそこのお前もこのボタンを押せ",
                "2rtで自分の検索履歴を公開\r\n(プライベートモードにしてる人は自分もう一回やろう)\r\n\r\nそこのお前もこのボタンを押せ",
                "4rtでロック画面とホーム画面を公開\r\n\r\nそこのお前もこのボタンを押せ",
                "5rtでボイスで恥ずかしいことを言う\r\n\r\nそこのお前もこのボタンを押せ",
                "当たり。5人にメッションしろ\r\n\r\nそこのお前もこのボタンを押せ",
                "中当たり。10人にメッションしろ\r\n\r\nそこのお前もこのボタンを押せ",
                "大当たり、15人以上にメッションしろ\r\n\r\nそこのお前もこのボタンを押せ",
                "腹筋300回やれもちろん休憩なしな\r\n\r\nそこのお前もこのボタンを押せ",
                "自分が持ってるアカウントを全部公開\r\n(Twitter内)\r\n\r\nそこのお前もこのボタンを押せ",
                "何もないよ\r\n\r\nただしこのツイートを見に来た奴ら全員このボタンを押せ"
            ];

            const randomIndex = Math.floor(Math.random() * tasks.length);
            const result = tasks[randomIndex];

            const msgs = await i.channel.messages.fetch(i.message.id);

            msgs.embeds.forEach(async (lembed) => {
                const value = lembed.footer.text;
                if (value !== "0") {
                    const Embed = new MessageEmbed()
                        .setColor(config.color)
                        .setTitle(`見たら絶対にやる(重め)ボタン`)
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
                        .setTitle(`見たら絶対にやる(重め)ボタン`)
                        .setDescription(`結果パターン: 26 通り`)
                        .setTimestamp()
                        .setFooter({ text: `${val}`, iconURL: '' });

                    const button = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(`fb_06`)
                                .setLabel(`やれ`)
                                .setStyle(`PRIMARY`),
                        );

                    msgs.edit({ embeds: [fEmbed], components: [button] });

                    if (value === "1") {
                        const finalEmbed = new MessageEmbed()
                            .setColor(config.color)
                            .setTitle(`見たら絶対にやる(重め)ボタン`)
                            .setDescription(`結果パターン: 26 通り`)
                            .setTimestamp()
                            .setFooter({ text: `回数制限に達しました。`, iconURL: '' });

                        const disabledButton = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(`fb_06`)
                                    .setLabel(`見たね？押してね？`)
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

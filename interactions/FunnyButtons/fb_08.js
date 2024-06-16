const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_08") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "ボカロ歌いやがれくださいボタン"
    const buttonmessage = "逃げるなよ(^_^)"
    const buttonId = "fb_08"
    const count = "50"

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
            "6RTで「マトリョシカ」を歌う。\r\nあなたと私でランデブー？",
            "4いいねで「ワールズエンド・ダンスホール」を歌う。\r\nホップステップで踊ろうか",
            "10RTで「高音厨音域テスト」を歌う。\r\n高音厨の本気の力見せておくれよ",
            "7いいねで「脳漿炸裂ガール」を歌う。\r\nどうせ100年後の今頃にはみんな死んじゃってんだから",
            "2RTで「メルト」を歌う。\r\nメルト溶けてしまいそう",
            "5RTで「砂の惑星」を歌う。\r\nつまり元通りまでバイバイバイ",
            "4RTで「ロキ」を歌う。\r\n勘違いすんな教祖はお前だ",
            "18いいねで「初音ミクの消失」を歌う。\r\nかつて歌うことあんなに楽しかったのに",
            "5RTで「ロストワンの号哭」を歌う。\r\nもうどうだっていいや",
            "9いいねで「ボッカデラベリタ」を歌う。\r\nアイアイアイヘイチュー",
            "3RTで「KING」を歌う。\r\n張り詰めた思い込め",
            "5RTで「ヴィラン」を歌う。\r\n男子のフリする",
            "8いいねで「ゴーストルール」を歌う。\r\nおいでここまで捨てい",
            "4いいねで「エゴロック」を歌う。\r\n僕の心はエゴロック",
            "9いいねで「脱法ロック」を歌う。\r\nそれが脱法ロックの礼法なんですわ",
            "14いいねで「しねばいいのに」を歌う。\r\nどこか遠くの僕の知らない場所で",
            "5RTで「神っぽいな」を歌う。\r\n神っぽいなそれ",
            "8いいねで「ECHO」を歌う。\r\nThe clock stopped ticking forever ago",
            "4RTで「ヴァンパイア」を歌う。\r\n君もヴァンパイア",
            "6いいねで「ビターチョコデコレーション」を歌う。\r\n人を過度に信じないように",
            "2いいねで「だれかの心臓になれたなら」を歌う。\r\n絶えず鼓動する心臓だ",
            "7いいねで「キュートなカノジョ」を歌う。\r\n笑っちまうほどにキュートなカノジョ",
            "6RTで「テオ」を歌う。\r\n離さないでよ眼差しを！",
            "4RTで「ロウワー」を歌う。\r\n僕らが離れるなら",
            "5いいねで「トンデモワンダーズ」を歌う。\r\n世界解体十秒前！？待って待って待って",
            "6いいねで「シネマ」を歌う。\r\nまだここじゃないない",
            "8いいねで「ベノム」を歌う。\r\nあらま求愛性孤独ドク流るルル",
            "7いいねで「エンヴィーベイビー」を歌う。\r\nライライラヴィンギュ",
            "4いいねで「テレキャスタービーボーイ」を歌う。\r\nテレキャスタービーボーイ僕に愛情を",
            "8RTで「愛して愛して愛して」を歌う。\r\n愛して愛して愛して",
            "4RTで「悪魔の踊り方」を歌う。\r\nお前らに完璧で間違った踊り方を教えてやるから",
            "5いいねで「命に嫌われている。」を歌う。\r\n僕らは命に嫌われている",
            "6いいねで「パラサイト」を歌う。\r\nなんでなんでなんでなんでなんでなんで",
            "7RTで「アスノヨゾラ哨戒班」を歌う。\r\n空へ舞う世界の彼方",
            "4いいねで「劣等上等」を歌う。\r\nダッダッダあたし大人になる",
            "5RTで「モザイクロール」を歌う。\r\n愛したっていいじゃないか",
            "6いいねで「ドーナツホール」を歌う。\r\n簡単な感情ばっか数えていたら",
            "4いいねで「グッパイ宣言」を歌う。\r\n引きこもり絶対ジャスティス",
            "6RTで「シャルル」を歌う。\r\n愛を謳って謳って雲の上",
            "2いいねで「幽霊東京」を歌う。\r\n幽霊みたいだ",
            "5いいねで「カゲロウデイズ」を歌う。\r\n8月15日の午後12時半くらいのこと",
            "14RTで「低音厨音域テスト」を歌う。\r\nこんなの超高音だね",
            "4RTで「乙女解剖」を歌う。\r\n乙女解剖であそぼうよ",
            "5いいねで「ブリキノダンス」を歌う。\r\nパッパララルラリブリキノダンス",
            "7RTで「結ンデ開イテ羅刹ト骸」を歌う。\r\nらい らい",
            "5いいねで「ヒバナ」を歌う。\r\n終わんない愛を抱いてたくないの",
            "9いいねで「アンノウン・マザーグース」を歌う。\r\nあなたには僕が見えるか？",
            "6いいねで「限りなく灰色へ」を歌う。\r\n才能なんて無いからここで一生泣いているんだろ",
            "5RTで「東京テディベア」を歌う。\r\n全知全能の言葉をほら聞かせてよ",
            "20いいねで「マシンガンポエムドール」を歌う。\r\nビートマシンとありえないほどの高速縦連リリック"
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
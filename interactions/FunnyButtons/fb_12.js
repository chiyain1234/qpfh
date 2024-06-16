const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_12") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "何か失う気がするボタン"
    const buttonmessage = "暇人はやれ"
    const buttonId = "fb_12"
    const count = "21"

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
            "17いいねでDMで誰かに告る(証拠もな)",
            "特に何も無いからあと1回ぐらい押したら？",
            "10いいねでスペース開く",
            "3RTで2ヶ月猫化",
            "15RTで顔面晒せ(加工はして良き)",
            "1いいねで1分\r\n1RTで3分\r\n押された分だけ勉強しよ",
            "2RTで精一杯の萌え声で\r\n『お帰りなさいませご主人様♡ご飯になさいますか、それともわたくしをいただきますか？』\r\nとボイスツイート",
            "いいねの数だけ黒歴史暴露",
            "13いいねでDMで嫌いって誰かに言う(証拠もな)",
            "3いいねで最近泣いたこと話す",
            "1RTで性癖暴露",
            "5RT自己紹介しろ(ボイスで)",
            "7RTで相方作れ\r\n(いる場合はもう1人作りましょ)",
            "15RT20いいね来なかったら1日浮上禁止",
            "6RTで一番最初にリプくれた人に言われたもの晒す",
            "1RTで最初のリプの人のペットになる(2週間)",
            "3RTで最初にリプくれた人の言うこと聴きまくる(3週間)",
            "3時間だけ猫化",
            "1いいねで性転換",
            "いいねしてくれたフォロワーさんの名前全員呼ぶ",
            "2RTでめっっっっちゃ恥ずかしかったこと暴露"
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
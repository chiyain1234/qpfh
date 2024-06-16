const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_11") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "おいおい見ただろ？ちゃんと押せよ罰ゲームボタン"
    const buttonmessage = "( ＞o＜)ｷｬｰ"
    const buttonId = "fb_11"
    const count = "19"

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
            "1いいねで好きなフォロワー1人メンションして愛を伝える\r\n\r\n♡",
            "1RTで「〇〇、キスしよっ？ダメ...かな？」と発言\r\n\r\n恥ずかしっ",
            "2いいねで黒歴史1つ暴露\r\n\r\nえっ、引いた",
            "2RTで1週間語尾に♡\r\n\r\nしゅき♡",
            "3いいねで相方作れ\r\n\r\nいる場合はもう1人",
            "3RTで彼女作れ\r\n\r\nちゃんとしろよ",
            "4いいねで「〇〇、そこはダメ//あー//♡」と発言\r\n\r\n〇〇のとこは好きな人",
            "4RTで一番好きなフォロワーにDMで告ってこい\r\n\r\n勇気出せや",
            "5いいねで「〇〇、いっぱい出たね♡」と発言\r\n\r\n〇〇は好きな人",
            "5RTで誰かとペアアイコン\r\n\r\nちゃんとやれ",
            "6いいねで1週間ｴｯｯアイコン\r\n\r\nあーあ",
            "6RTで「〇〇好きいいいいいいいいいいいいいいいい！」と発言",
            "7いいねであるフォロワーと文セ\r\n\r\nちゃんとやろ",
            "7RTで好きな画像4枚貼る\r\n\r\n当たりやね",
            "8いいねで1週間語尾ににゃん\r\n\r\nかわいそうにゃん笑",
            "リプに来た言葉を発言する\r\n\r\nやれ",
            "9いいねで「〇〇、明日の夜楽しみだね♡」と発言",
            "9RTで彼女とリプでイチャイチャしろ\r\n\r\nいないやつは作れ",
            "当たり！\r\n\r\nいいねの数だけ黒歴史暴露"
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
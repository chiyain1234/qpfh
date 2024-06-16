const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_14") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "○rtで晒す地獄なボタン"
    const buttonmessage = "押せよ???"
    const buttonId = "fb_14"
    const count = "11"

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
            "2rtで手を晒す\r\nかわいそうにwwwwww\r\n見たお前!!!押せよ!!!!",
            "5rtで本名の頭文字晒す\r\n特定班いそげwwwwww\r\n見たお前!!!押せよ!!!!",
            "1rtで性癖3つ晒す\r\n変態だねwwwwww\r\n見たお前!!!押せよ!!!!",
            "10rtで後ろ姿晒す\r\nあははwwwww\r\n見たお前!!!押せよ!!!!",
            "なんもないよおめでとう!!!\r\nただし見た人は押してね???\r\n見たお前!!!oseyona!!!!(?)",
            "なんもないよおめでとう!!!\r\nって言うと思ったか？\r\n3rtで声晒す内容は「好きだよ」でね!!!!www\r\n見たお前!!!押せよ!!!!",
            "おわああああ大ハズレ!!!!!\r\n1rtで3人に告白OKされるまでいろんな相互にDM!!!\r\nもちろん証拠もね!!!!\r\n見たお前!!!押せよ!!!!",
            "4rtで今着てる服晒す\r\nおしゃれさんかな????\r\nまぁ違うかwwww\r\n見たお前!!!押せよ!!!!",
            "6rtで作業机晒す\r\n綺麗にしてあるかな?\r\n見たお前!!!押せよ!!!!",
            "50rtで住んでる都道府県晒す\r\nまぁ無理でしょうね\r\n見たお前!!!押せよ!!!!",
            "3rtで十分仲良いと思う人にメンション!!!\r\nメンションされた人はもちろん押せ!!!!\r\n見たお前!!!押せよ!!!!"
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
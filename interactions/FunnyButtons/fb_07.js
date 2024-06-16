const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_07") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "絵描きさん用のボタン"
    const buttonmessage = "気軽に押してね"
    const buttonId = "fb_07"
    const count = "35"

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
            "2RTされたらあなたは女装（男装）している推しを描きましょう",
            "10RTされたらあなたはＨなイラストを描きましょう",
            "3いいねされたらあなたは女性キャラを描きましょう",
            "4いいねされたらあなたは男性キャラを描きましょう",
            "5RTされたらあなたは白衣を着た推しを描きましょう",
            "4いいねされたらあなたはナース服を着た推しを描きましょう",
            "3いいねされたらあなたは好きなキャラを赤面させましょう",
            "当たり！\n何も描かなくていいです！",
            "あなたはRTされた分だけイラストを描きましょう",
            "5RTされたらあなたは絵柄を封印してイラストを描きましょう",
            "大当たり！\nリプ来たフォロワーさんの推しを描きましょう！",
            "9いいねされたらあなたは持てる限りの力でカッコいい絵柄でイラストを描きましょう",
            "2いいねされたらあなたは推しに猫耳を生やしましょう",
            "15いいねされたらあなたは燕尾服を推しに着せましょう",
            "5いいねされたらあなたはメイド服を好きなキャラに着せましょう",
            "3いいねされたらあなたはフリフリの可愛い服を好きなキャラに着せましょう",
            "5RTされたらあなたはおじ様キャラを描きましょう",
            "3いいねされたらあなたは好きなキャラに水着を着せましょう",
            "9いいねされたらあなたはベビードールを推しに着せましょう",
            "1いいねされたらあなたは利き手ではない手で絵を描きましょう",
            "3RTされたらあなたは擬人化を描きましょう",
            "5RTされたらあなたは幸せそうな推しを描きましょう",
            "1RTされたらあなたは絶望している推しを描きましょう",
            "2RTされたらあなたはゲス顔を好きなキャラで描きましょう",
            "1いいねされたらあなたはパジャマ姿の推しを描きましょう",
            "20RTされたらあなたは一コマ漫画を描きましょう",
            "15RTされたらあなたは漫画を描きましょう（枚数の指定なし）",
            "3いいねされたらあなたは泣いている推しを描きましょう",
            "8いいねされたらあなたはバニー服を推しに着せましょう",
            "7RTされたらあなたはスーツ姿の推しを描きましょう",
            "7RTされたらあなたはラフな格好をしている推しを描きましょう",
            "4いいねされたらあなたは眠っている推しを描きましょう",
            "15いいねされたらあなたは媚薬を飲まされた推しを描きましょう",
            "6いいねされたらあなたは持てる限りの力で可愛く推しを描きましょう",
            "7RTされたらあなたは酔っ払っている推しを描きましょう"
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
const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_17") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "たのしいたのしいボタン"
    const buttonmessage = "押すよね？"
    const buttonId = "fb_17"
    const count = "13"

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
            "5RTで、\n誰にも言ったことないこと暴露する\n\n押してみて！",
            "6RTで、\n1分で書いた絵をFFさんにプレゼントする\n\n見た人はボタン押してね！",
            "10RTで、\n自分の目公開する\n\n見た人逃げんなよ\n\nお前のことだからな",
            "2RTで、\n初恋何歳か暴露！\n\nおしてください！",
            "お前は助かったようだな、\n\nみんなに押してもらえ",
            "4RTで、\nFFさん2人にDMで、\n愛の告白♥\nｷｬ─(´∩ω∩｀)─♡\n\nみたら押してね",
            "3RTで、\n今正直に思ったこと暴露！\n\n押してみてね\n( ｡･ω･｡)ﾉ 凸ﾎﾟﾁｯ!",
            "1RTで、\n自分のキーボード晒す\n\nボタン押そうね！",
            "7RTで、\n最近よく食べてるもの晒そ\n\n絶対押せよ(*º▿º*)",
            "8RTで、\n好きなテレビ番組晒せ\n\n押してみよ！",
            "9RTで、\n机の上晒してみよう！\n\n絶対だから\n押してみてね！",
            "リプしてくれた子に、\n第一印象伝える！\n\n絶対しろよ！",
            "大吉ーー！\n\nみんなに好きなの好きなこと5個伝える\n\nしようね！\n圧)))(●︎´▽︎`●︎)🔪"
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
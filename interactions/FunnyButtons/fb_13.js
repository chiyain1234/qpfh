const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_13") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "押したらやばいかもしれんボタン"
    const buttonmessage = "色々と種類ある☆"
    const buttonId = "fb_13"
    const count = "12"

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
            "大当たり！5人メンションして押させよう！",
            "当たり！3人メンションして押させよう！",
            "10RTで「ねぇ....今どこいるの...?他の人と喋ったらだめだよ...?離れないでね....?」と音声発言\r\nどんまい☆",
            "一週間語尾にゃん\r\n頑張れ☺️☺️☺️",
            "一ヶ月一番最初にRTとした人のメイドになる",
            "3RTで「かまって欲しいな♡離れないで♡」と発言",
            "最初にリプした人のお願い一個聞く",
            "4RTで「ご主人様....許してにゃん♡」と発言",
            "ハズレ！あと5回押してねｯｯ☆",
            "大ハズレ！あと10回押そうねっっっっっ☺️",
            "2RTでロック画面&ホーム画面晒す",
            "2RTで「かまってほしいよぉ....むぅ....」と発言"
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
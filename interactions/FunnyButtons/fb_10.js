const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_10") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "( ˙◁˙ 👐)視界に入った瞬間押す割と地獄なボタン"
    const buttonmessage = "押しなさいな★"
    const buttonId = "fb_10"
    const count = "17"

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
            "5いいねor3RTで「ご主人様、おかえりなさい♡」と音声発言\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "3いいねで手晒す\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "大ハズレ！後10回押そう！\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "ハズレ！後3回押そう！\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "小当たり！3人メンションしてボタンを押させよう！\r\n複数回メンションされた人はメンションされた回数押そう！\r\nこれを引いた貴方はそこそこ運がいいね！",
            "当たり！5人メンションしてボタンを押させよう！\r\n複数回メンションされた人はメンションされた回数押そう！\r\nこれを引いた貴方は運がいいね！",
            "大当たり！10人メンションしてボタンを押させよう！\r\n複数回メンションされた人はメンションされた回数押そう！\r\nこれを引いた貴方はとてつもなく運がいいね！",
            "8いいねで目晒す\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "10いいねで顔晒す\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "5いいねで足晒す\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "10RTで恋愛的に好きな人に告白！\r\n上手くいくといいね！\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "15RTで自撮り晒す\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "10RTでDM欄で一番上の人に告白！\r\n恥ずかしいけどやってね！勿論証拠も！\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "3いいねで身長晒す\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "5いいねで体重晒す\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "5いいねで2週間語尾に「…♡/」を付ける\r\n逃げるんじゃねえぞ٩( ᐛ )و",
            "5いいねで2週間語尾に「/…♡」を付ける\r\n逃げるんじゃねえぞ٩( ᐛ )و"
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
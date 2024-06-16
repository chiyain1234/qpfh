const client = require('../../index.js');
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');

client.on("interactionCreate", async (i) => {
if (i.customId === "fb_16") {
    const earnCashCommandCooldown = new CommandCooldown('earnCash', ms("10s"));

    const buttonName = "メス堕ち阻止チャレンジボタン"
    const buttonmessage = "君はメス堕ちしてしまうのか"
    const buttonId = "fb_16"
    const count = "23"

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
            "「だ、誰がメスになんかな、ぁﾞ、あﾞ！そこやめッ、やﾞぁッ♡♡ゃ、ぁんﾞッ♡ぉﾞ♡♡♡」と発言する",
            "「やだッ、やだ、や、そこだめぇﾞ♡女の子なるッ♡♡おんにﾞゃのこになっちﾞゃぅﾞぅう♡♡♡♡♡」と発言する",
            "「だめ♡だめなの♡めしゅになゅ♡♡めしゅになっちゃうからッ♡♡♡ゆるひ──ひぅん♡♡♡」と発言する",
            "「ぁ、ぁゆるﾞしてッ♡♡ごめ、なさぁあﾞあﾞ♡♡♡もうしませッ、もうしません♡♡♡♡メスのくせにごめんなしゃ──ぉﾞっ♡♡♡」と発言する",
            "「屈する♡屈しちゃう♡♡男なのにッ、女の子にされちゃうッ♡♡メスになっちゃうの♡♡♡♡」と発言する",
            "「おﾞひっ♡♡は、ぁﾞぁﾞ♡♡負けちゃうッめしゅになぅ♡♡♡堕ちちゃうのッ！はぅﾞん♡♡♡」と発言する",
            "「あっあっあっきもちぃ、きもちいのすきッ♡♡ひぃﾞッ、おんなのこになっちゃう♡♡ぉﾞッ──」と発言する",
            "「いやぁﾞぁ！やらﾞッ、んッ♡やら、堕ちたくない！ぉﾞッ♡メスになんかぁ♡♡ならな──ぁﾞあぁﾞッ♡♡♡♡」と発言する",
            "「ごめ♡♡ごめんなしゃッ♡♡もうやらッ壊れる♡♡壊れちゃうのッ♡♡♡メス堕ちすゅのぉﾞぉ♡♡♡」と発言する",
            "「おひ♡♡馬鹿めッ、ひんッ♡♡♡この程度でッ♡♡屈するとでも、ぉﾞッ♡♡思った、か、ぁﾞっあっああ♡♡♡♡」と発言する",
            "「おねが♡ゆるひて♡ぁﾞひ♡♡頭おかしくなぅのッ♡おﾞ♡男なのにﾞっ♡♡おんなのこみたいになるのﾞ♡♡♡♡」と発言する",
            "「ァﾞ♡ぁっあっあぁﾞ認めますッ！メスです♡♡認めますッ♡♡♡ひん♡ほ、ほら言った♡言ったからもう離し──ゃﾞああぁﾞ♡♡♡」と発言する",
            "「違うッ♡ぉﾞッ♡メス堕ちしてないッ♡♡メス堕ちなんてぇﾞ♡する訳な、ひぃんﾞ♡そこやだぁﾞぁ♡♡」と発言する",
            "「ひッ♡女の子スイッチ♡♡♡おしゃないれっ♡♡♡そこらめなのっ♡♡あたま♡あたまおﾞかひくなぅのっ♡♡♡」と発言する",
            "「ゅるひてぇﾞ♡♡分かったの♡もうメスって分かったの♡♡ごめんなしゃい♡思い上がって、ぇﾞッ♡ごめんなひゃ──んぉﾞぉおッ♡♡♡」と発言する",
            "「嘘♡うそつかないでくだしゃ♡♡メスなんかじゃ、おひッ♡ありまひぇん♡♡どこからどうッ見ても♡ぉﾞ、男ですっ♡♡♡♡」と発言する",
            "「ぁﾞはぁ♡おﾞんなのこきもちいのっ♡♡こ、こぇならッ♡♡もっと早く♡おんなのこなれば、ひん♡よかっひゃ♡♡ぉっおﾞ♡♡〜〜〜〜♡♡♡」と発言する",
            "「らﾞめなのッ♡♡ぁﾞっ、メスなっぢゃうﾞのﾞ♡♡♡んぅﾞう〜〜♡♡♡メス堕ちだめなのぉﾞッだめ、らめﾞ、だ──ッ♡〜〜〜〜〜♡♡」と発言する",
            "「っあﾞっ♡♡こんなﾞことっ♡おがひぃ♡メスになんてッ♡♡なぅわけっ♡♡なる訳っ♡な、ぁ、あﾞ〜〜〜♡♡♡♡」と発言する",
            "「堕ちてないッ♡ひぅﾞ♡♡堕ちてないッ♡♡まだ堕ちてないのっ♡♡ぁﾞ、あっ♡だからっ♡♡まだ、んﾞッ♡やめないでぇ♡♡」と発言する",
            "「おﾞッ♡〜〜〜〜〜♡♡♡うぁﾞ、違うッ！違う今のはッ♡♡あんﾞ♡堕ちてないﾞ♡♡堕ちてないぞ♡♡メスなんか♡なる訳ぇえﾞ♡♡♡♡」と発言する",
            "「めすッ♡ぁひッ♡めす♡めすにしてくだひゃ♡♡♡おﾞっ♡もっとおんにゃのこにしてぇッ♡♡♡めしゅおちしたいのぉおﾞ♡♡♡」と発言する",
            "「めﾞす♡ゃﾞだ♡♡ぉﾞッ♡それやだ♡♡あたまばかになっひゃうッ♡や、やだぁ、あﾞッぁ、ッ、〜〜〜〜〜〜♡♡♡♡」と発言する"
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
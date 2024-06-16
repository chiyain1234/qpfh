const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const cmdName = "tl"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("話題を提供する。"),

    async execute(i, client) {
        let arr = [
            "予測変換で1人しりとりしろ", 
            "悪口か下ネタ出るまで50音順に言う", 
            "キャラクターの名前を50音順にいう", 
            "食べ物の名前を50音順に言う", 
            "お金がない理由は24番目の写真にある", 
            "あ行で女子力がわかるらしい",
            "あ行の後にハートを付けるとかなり恥ずかしい見た人も道連れだからな",
            "怒りませんので第一印象と今の印象を引用RTで言ってみてください",
            "いいねした人の名前を書く",
            "私が絡みに行っても迷惑じゃないよって人いいねむしろ積極的に絡んでほしい人rtお前のことお気に入りだぜって人リプして欲しいけど誰もいないと思うので好きな飲み物を言う",
            "私のことなんて呼んでますか見た人もやれ",
            "見た人強制自己紹介",
            "私を漢字二文字で表してください",
            "懐かしい写真をはる",
            "1人の時ついやっちゃぅ恥ずかしい癖",
            "デスクトップ晒す",
            "ホーム画面晒す",
            "1秒で嘘と分かることを言う",
        ];
        var random = Math.floor(Math.random() * arr.length);
        var de = arr[random]

        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(i.user.username)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setThumbnail(`${i.user.displayAvatarURL()}`)
            .setDescription(`${de}`)
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });

        i.reply({ embeds: [Embed] });
    }
}
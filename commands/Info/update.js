const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName('update')
        .setDescription('TanTanのアップデート情報を見る。'),

    async execute(i, client) {
        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`**TanTanアップデート情報 (2024/6/16更新)**`)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription("ご利用ありがとうございます。\nTanTanは1年3ヶ月ぶりの更新になります。新コマンドの追加や、コマンド名の変更、削除済みコマンドがあるので、以下にそれらを示します。\n文字数制限のため、一部を書きます。そのため、他はサポートサーバーにすべて書いておきます。\n不具合があればサポートサーバーに言いに来てください。")
            .addFields(
                { name: '新コマンド一覧(476)', value: "/generate robokasu, /generate fusion, /generate strechgif, /generate shrinkgif, /generate rotategif, /generate flip, /generate blowup, /generate wall, /generate goodfriend, /generate symmetry, /character anime lovelive ...他"}, 
                { name: 'コマンド名変更一覧', value: "ざっくり言うと、カテゴリーごとにコマンド名をつけました。\n例: /xd -> /fun xd ...他"},
                { name: 'その他変更点', value: "- 電卓機能,\n- アニメ画像コマンド,\n- 動物画像コマンド,\n- /game flag で解答表示ボタンを追加,\n- /_help でのスタイルを変更,\n- ボットのアバター、バナーを変更,\n- カテゴリーを増加,\nステータスメッセージを変更,\n- 他、コマンドすべてを適切に修正", inline: false },
            )
            .setTimestamp()
            .setFooter({ text: i.toString() });

        i.reply({ content: "https://discord.gg/3WYXZWDRD7", embeds: [embed] });
    }
};

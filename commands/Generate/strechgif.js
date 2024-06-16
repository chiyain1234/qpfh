const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('stretchgif')
        .setDescription('指定したユーザーのアバターに縦方向の伸縮効果を適用し、GIFとして生成します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false)),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const avatarURL = user.displayAvatarURL({ format: 'png', size: 128 });

            // キャンバスのサイズを設定
            const canvas = Canvas.createCanvas(128, 128);
            const context = canvas.getContext('2d');

            // GIFエンコーダーを作成
            const encoder = new GIFEncoder(128, 128);
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(30); // フレームごとの遅延を短くすることで速度を速くする
            encoder.setTransparent(0x00FF00); // GIFの背景色を透明に設定

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // フレームごとにアバターのサイズを変更してエンコーダーに追加
            const frames = 30;
            for (let frame = 0; frame < frames; frame++) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                const scale = 1 + Math.sin(frame * Math.PI / frames); // サイン関数を使用して縦方向のスケールを変化させる
                const width = canvas.width;
                const height = avatarBuffer.height * scale;
                const x = 0;
                const y = canvas.height - height; // 縮んだ後の終点を画像の一番下にする

                context.drawImage(avatarBuffer, x, y, width, height);
                encoder.addFrame(context);
            }

            // GIFを完成させてバッファを取得
            encoder.finish();
            const buffer = encoder.out.getData();

            // メッセージにGIFを添付して送信
            const attachment = new MessageAttachment(buffer, 'stretch.gif');
            const embed = new MessageEmbed()
                .setTitle(`${user.username} is stretching.`)
                .setImage('attachment://stretch.gif')
                .setColor(client.config.color)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });

            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.followUp({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    },
};

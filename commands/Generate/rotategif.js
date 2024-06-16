const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 10,
    data: new SlashCommandSubcommandBuilder()
        .setName('rotategif')
        .setDescription('指定したユーザーのアバターを回転させたGIFを生成します。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('direction')
                .setDescription('回転の向きを選択してください。')
                .setRequired(false)
                .addChoices({name: '時計回り', value: 'clockwise'},
                           {name: '反時計回り', value: 'counterclockwise'})),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target') || interaction.user;
            const direction = interaction.options.getString('direction') || 'clockwise';
            const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 });

            // キャンバスのサイズを設定
            const canvas = Canvas.createCanvas(128, 128);
            const context = canvas.getContext('2d');

            // GIFエンコーダーを作成
            const encoder = new GIFEncoder(128, 128);
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(50); // フレームごとの遅延を少し長くすることで速度を遅くする
            encoder.setTransparent(0x00FF00); // GIFの背景色を透明に設定

            // アバター画像を読み込んでバッファに変換
            const avatarBuffer = await Canvas.loadImage(avatarURL);

            // フレームごとにアバターのサイズを変更してエンコーダーに追加
            const frames = 30;
            for (let frame = 0; frame < frames; frame++) {
                context.clearRect(0, 0, canvas.width, canvas.height);

                // 円形のクリッピングパスを設定
                context.save();
                context.beginPath();
                context.arc(64, 64, 64, 0, Math.PI * 2, true);
                context.closePath();
                context.clip();

                let angle = (frame / frames) * 2 * Math.PI; // 角度を計算
                if (direction === 'counterclockwise') {
                    angle = -angle;
                }
                context.translate(canvas.width / 2, canvas.height / 2); // 中心を移動
                context.rotate(angle); // 回転
                context.drawImage(avatarBuffer, -64, -64, 128, 128); // 中心に画像を描画
                context.restore();

                encoder.addFrame(context);
            }

            // GIFを完成させてバッファを取得
            encoder.finish();
            const buffer = encoder.out.getData();

            // メッセージにGIFを添付して送信
            const attachment = new MessageAttachment(buffer, 'rotate.gif');
            const embed = new MessageEmbed()
                .setTitle(`${user.username} is rotating.`)
                .setImage('attachment://rotate.gif')
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

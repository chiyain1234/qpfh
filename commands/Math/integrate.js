const { createCanvas, loadImage } = require('canvas');
const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const mathjax = require('mathjax-node');
const Algebrite = require('algebrite');
const math = require('mathjs');

const cmdName = 'integrate';

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('関数の不定積分または定積分を計算します。')
        .addStringOption(option => option.setName('function')
            .setDescription('積分する関数を入力してください。例: x^2')
            .setRequired(true))
        .addStringOption(option => option.setName('variable')
            .setDescription('積分変数を指定してください。例: x')
            .setRequired(true))
        .addStringOption(option => option.setName('lower_limit')
            .setDescription('下端を指定してください。例: -Infinity'))
        .addStringOption(option => option.setName('upper_limit')
            .setDescription('上端を指定してください。例: Infinity')),

    async execute(i, client) {
        await i.deferReply();

        const func = i.options.getString('function');
        const variable = i.options.getString('variable');
        const lowerLimit = i.options.getString('lower_limit');
        const upperLimit = i.options.getString('upper_limit');

        try {
            let result;
            if (lowerLimit && upperLimit) {
                // 不定積分を計算
                const indefiniteIntegral = Algebrite.run(`integral(${func}, ${variable})`).toString();

                // 上端を代入
                const upperValue = Algebrite.run(`${indefiniteIntegral}`).toString().replace(new RegExp(variable, 'g'), upperLimit);
                
                // 下端を代入
                const lowerValue = Algebrite.run(`${indefiniteIntegral}`).toString().replace(new RegExp(variable, 'g'), lowerLimit);
                
                // 定積分を計算
                result = math.evaluate(`${upperValue} - (${lowerValue})`);
            } else {
                // 不定積分を計算
                result = Algebrite.run(`integral(${func}, ${variable})`).toString();
            }

            // 計算結果に "stop" が含まれている場合、画像を送信せずにエラーメッセージを送信
            if (result.toString().includes('Stop')) {
                await i.editReply("計算できませんでした。");
                return;
            }

            // LaTeX形式の積分式を生成
            const latexString = lowerLimit && upperLimit ?
                `\\int_{{${lowerLimit}}}^{{${upperLimit}}} ${func} \\, d${variable} = ${result}` :
                `\\int ${func} \\, d${variable} = ${result} + C`;

            // MathJaxを使用してLaTeX数式をSVGに変換
            mathjax.config({
                MathJax: {}
            });
            mathjax.start();
            const svg = await new Promise((resolve, reject) => {
                mathjax.typeset({
                    math: latexString,
                    format: "TeX",
                    svg: true,
                    scale: 2.5, // テキストサイズを大きくする
                }, (data) => {
                    if (data.errors) {
                        reject(data.errors);
                    } else {
                        resolve(data.svg);
                    }
                });
            });

            // SVGをPNGに変換するためのCanvasを作成
            const width = 300; // 幅を広げて数式が収まるようにする
            const height = 100; // 高さを広げて数式が収まるようにする
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            // 背景を白に設定
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);

            // SVGを描画
            const svgImage = await loadImage(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
            const imageWidth = svgImage.width;
            const imageHeight = svgImage.height;

            // 中央に配置するように調整
            const xOffset = (width - imageWidth) / 2;
            const yOffset = (height - imageHeight) / 2;
            ctx.drawImage(svgImage, xOffset, yOffset);

            // Discordに送信するためのEmbedを作成
            const attachment = new MessageAttachment(canvas.toBuffer(), 'integral.png');
            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('積分の結果')
                .setDescription(`${lowerLimit && upperLimit ? '定積分' : '不定積分'}を計算`)
                .addFields({name: '入力した関数', value: `\`${func}\``})
                .addFields({name: '積分変数', value: `\`${variable}\``})
                .addFields({name: '下端', value: `\`${lowerLimit || '未指定'}\``})
                .addFields({name:'上端', value: `\`${upperLimit || '未指定'}\``})
                .setImage('attachment://integral.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
          
            await i.editReply({ embeds: [Embed], files: [attachment] });
        } catch (err) {
            console.error(err);
            await i.editReply("積分の計算に失敗しました。");
        }
    }
};

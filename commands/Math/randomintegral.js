const { createCanvas, loadImage } = require('canvas');
const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const MathJax = require('mathjax-node');
const cmdName = 'randomintegral';

MathJax.config({
    MathJax: {
        SVG: {
            font: "TeX"
        }
    }
});
MathJax.start();
// 数学演算子や関数などの定義
const operators = ['+', '-', '*', '/'];
const functions = ['sin', 'cos', 'tan', 'log'];

// ランダムな要素を選択して式を構築する関数
function generateRandomExpression(depth = 0, useFraction = true) {
    let expression = ''; // 最初は空にする
    let isFirst = true; // 一番最初の要素かどうかのフラグ

    if (useFraction) {
        // 分母または分子に積分式が来る場合
        expression = `\\frac{${generateSingleRandomExpression(depth)}}{${generateSingleRandomExpression(depth)}}`;
    } else {
        // 分数が一つも出てこない場合
        expression = generateSingleRandomExpression(depth);
    }

    return expression;
}

// 分母または分子に積分式が来るかどうかを制御して式を構築する関数
function generateSingleRandomExpression(depth = 0) {
    let expression = ''; // 最初は空にする
    let isFirst = true; // 一番最初の要素かどうかのフラグ

    for (let i = 0; i < depth; i++) {
        // 最初の要素の場合は演算子を省略する
        const operator = isFirst ? '' : ` ${operators[Math.floor(Math.random() * operators.length)]} `;
        isFirst = false; // 一度フラグをfalseに設定したら、次の要素は必ず演算子が入る

        // 係数をランダムに選択（1は省略）
        const coefficient = Math.floor(Math.random() * 9) + 2; // 2から9のランダムな整数

        // 関数または指数をランダムに選択
        const randomChoice = Math.random();
        if (operator.trim() === '/') {
            // 分数の場合
            const numerator = functions[Math.floor(Math.random() * functions.length)];
            const denominator = functions[Math.floor(Math.random() * functions.length)];

            // 分子と分母が等しい場合は省略
            if (numerator !== denominator) {
                expression += ` \\frac{${numerator}(x)}{${denominator}(x)}`;
            }
        } else {
            if (randomChoice < 0.2) {
                // 関数をランダムに選択
                const func = functions[Math.floor(Math.random() * functions.length)];
                if (func === 'log') {
                    expression += `${operator}${coefficient} \\cdot ${func}_e(x)`; // 自然対数関数の指定
                } else {
                    expression += `${operator}${coefficient} \\cdot ${func}(x)`;
                }
            } else if (randomChoice < 0.4) {
                // 指数関数のランダム選択
                const base = Math.random() < 0.5 ? 'e' : (Math.floor(Math.random() * 9) + 1); // ベースをランダムに選択
                expression += `${operator}${coefficient} \\cdot ${base}^x`; // 指数関数の指定
            } else if (randomChoice < 0.6) {
                // x のべき乗
                const power = Math.floor(Math.random() * 9) + 1; // 1から9のランダムな整数
                expression += `${operator}${coefficient} \\cdot x^${power}`; // x のべき乗の指定
            } else {
                // デフォルトは sin, cos, tan のような関数
                const func = functions[Math.floor(Math.random() * functions.length)];
                if (func === 'log') {
                    expression += `${operator}${coefficient} \\cdot ${func}_e(x)`; // 自然対数関数の指定
                } else {
                    expression += `${operator}${coefficient} \\cdot ${func}(x)`;
                }
            }
        }
    }
    return expression;
}

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('ランダムな積分を提供します。')
        .addIntegerOption(option => option.setName('depth')
            .setDescription('生成される式の深さを指定します。')
            .setRequired(true)),

    async execute(i, client) {
        await i.deferReply();

        const depth = i.options.getInteger('depth');

        // 分数を使うかどうかをランダムに決定
        const useFraction = Math.random() < 0.5;

        // ランダムな式を生成
        const randomExpression = generateRandomExpression(depth, useFraction);

        // LaTeX形式の積分式を生成
        const latexString = `\\int ${randomExpression} \\, dx`;

        try {
            // MathJaxを使用してLaTeX数式をSVGに変換
            const svg = await new Promise((resolve, reject) => {
                MathJax.typeset({
                    math: latexString,
                    format: "TeX",
                    svg: true,
                }, (data) => {
                    if (data.errors) {
                        reject(data.errors);
                    } else {
                        resolve(data.svg);
                    }
                });
            });

            // SVGをPNGに変換するためのCanvasを作成
            const width = 500;
            const height = 100;
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
            const attachment = new MessageAttachment(canvas.toBuffer(), 'random_integral.png');
            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('ランダムな積分の問題')
                .setDescription(`次の積分を解いてください：`)
                .setImage('attachment://random_integral.png')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });

            await i.editReply({ embeds: [Embed], files: [attachment] });
        } catch (err) {
            console.error(err);
            await i.editReply("積分の問題を生成できませんでした。");
        }
    }
};

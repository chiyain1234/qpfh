const { createCanvas, loadImage } = require('canvas');
const math = require('mathjs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require("discord.js");
const cmdName = "graph";

const width = 1200;
const height = 1200;
const chartCallback = (ChartJS) => {
    // グローバルチャート設定
};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

const backgroundColorPlugin = {
    id: 'backgroundColorPlugin',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = '#1e2124';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    cooldown:10,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('指定した関数のグラフを表示する。')
        .addStringOption(option => option.setName('function1')
            .setDescription('最初の関数を入力してください。 例: y=x')
            .setRequired(true))
        .addStringOption(option => option.setName('function2')
            .setDescription('2つ目の関数を入力してください。 例: y=x^2')
            .setRequired(false))
        .addStringOption(option => option.setName('function3')
            .setDescription('3つ目の関数を入力してください。 例: y=sin(x)')
            .setRequired(false))
        .addStringOption(option => option.setName('function4')
            .setDescription('4つ目の関数を入力してください。 例: y=cos(x)')
            .setRequired(false)),

    async execute(i, client) {
        await i.deferReply();
        const functions = [
            i.options.getString('function1'),
            i.options.getString('function2'),
            i.options.getString('function3'),
            i.options.getString('function4')
        ].filter(Boolean); 

        try {
            // 各関数のXとYの値を計算
            const datasets = [];
            const colors = ['rgba(75, 192, 192, 1)', 'rgba(192, 75, 192, 1)', 'rgba(192, 192, 75, 1)', 'rgba(75, 75, 192, 1)'];

            functions.forEach((func, index) => {
                try {
                    // 'y='を削除して数式を準備
                    const expr = math.compile(func.replace('y=', ''));

                    // Xの範囲を設定
                    const xValues = Array.from({ length: 201 }, (_, i) => (i - 100) / 10); // -10から10まで0.1刻み

                    const yValues = xValues.map(x => {
                        try {
                            const y = expr.evaluate({ x });
                            if (isNaN(y) || !isFinite(y)) {
                                return { x, y: NaN };
                            }
                            return { x, y };
                        } catch {
                            return { x, y: NaN }; // 無効な計算結果をNaNとして扱う
                        }
                    }).filter(point => !isNaN(point.y)); // NaNの点を除外

                    datasets.push({
                        label: `y = ${func.replace('y=', '')}`,
                        data: yValues,
                        borderColor: colors[index],
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0 // 各点の丸を表示しない
                    });
                } catch (err) {
                    console.error(`Error evaluating function ${func}:`, err);
                }
            });

            // x=0 の関数を追加
            datasets.push({
                label: 'x=0',
                data: [{ x: 0, y: Math.min(...datasets.flatMap(d => d.data.map(p => p.y))) }, { x: 0, y: Math.max(...datasets.flatMap(d => d.data.map(p => p.y))) }],
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            });

            // y=0 の関数を追加
            datasets.push({
                label: 'y=0',
                data: [{ x: Math.min(...datasets.flatMap(d => d.data.map(p => p.x))), y: 0 }, { x: Math.max(...datasets.flatMap(d => d.data.map(p => p.x))), y: 0 }],
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            });

            const configuration = {
                type: 'line',
                data: {
                    datasets: datasets
                },
                options: {
                    maintainAspectRatio: false, // アスペクト比を維持しない
                    width: width, // チャートの幅
                    height: height, // チャートの高さ
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                color: 'white'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.2)'
                            }
                        },
                        y: {
                            ticks: {
                                color: 'white'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.2)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        },
                        backgroundColorPlugin: backgroundColorPlugin
                    },
                    layout: {
                        padding: {
                            left: 40,
                            right: 40,
                            top: 40,
                            bottom: 40
                        }
                    },
                    elements: {
                        line: {
                            borderWidth: 2 // 線の太さを調整
                        }
                    }
                }
            };

            const image = await chartJSNodeCanvas.renderToBuffer(configuration);

            // 灰色の下地としてCanvasを作成
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            // 灰色の下地を描画
            ctx.fillStyle = '#1e2124'; // 背景色を #1e2124 に設定
            ctx.fillRect(0, 0, width, height);

            // グラフの画像を重ねる
            const graph = await loadImage(image);
            ctx.drawImage(graph, 0, 0, width, height);
            const functionStrings = functions.map(func => `y = ${func.replace('y = ', '')}`);
            const functionsString = functionStrings.join('\n');
            // Discordに送信するためのEmbedを作成
            const attachment = new MessageAttachment(canvas.toBuffer(), 'chart.png');
            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle('グラフ描画')
                .setDescription(functionsString)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setImage('attachment://chart.png')
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            const intersectionPoints = [];
            for (let i = 0; i < functions.length; i++) {
                for (let j = i + 1; j < functions.length; j++) {
                    for (const point1 of datasets[i].data) {
                        for (const point2 of datasets[j].data) {
                            if (Math.abs(point1.x - point2.x) < 0.01 && Math.abs(point1.y - point2.y) < 0.01) {
                                const intersectionX = point1.x;
                                const intersectionY = point1.y;
                                intersectionPoints.push({ x: intersectionX, y: intersectionY });
                                if (intersectionPoints.length >= 10) break;
                            }
                        }
                        if (intersectionPoints.length >= 10) break;
                    }
                    if (intersectionPoints.length >= 10) break;
                }
                if (intersectionPoints.length >= 10) break;
            }


            // 重複を除去して、最大で10個までの交点を取得
            const uniqueIntersectionPoints = Array.from(new Set(intersectionPoints.map(p => JSON.stringify(p)))).map(str => JSON.parse(str)).slice(0, 10);

            // 交点が見つかった場合は、それらを表示する
            if (uniqueIntersectionPoints.length > 0) {
                Embed.addFields(
                    uniqueIntersectionPoints.map((point, index) => ({
                        name: `交点 ${index + 1}`,
                        value: `x: ${point.x}, y: ${point.y}`,
                        inline: true
                    }))
                );
            } else {
                Embed.addFields({ name: '交点', value: '見つかりませんでした。' });
            }



            await i.editReply({ embeds: [Embed], files: [attachment] });
        } catch (err) {
            console.error(err);
            await i.editReply("グラフの取得ができませんでした。");
        }
    }
};
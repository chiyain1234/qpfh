const { createCanvas, loadImage } = require('canvas');
const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const MathJax = require('mathjax-node');
const math = require('mathjs');

const cmdName = 'limit';

function calculateLimit(f, variable, point) {
    try {
        let limitValue;
        if (point === 'Infinity') {
            const denominatorValue = math.evaluate(f.replace(new RegExp(variable, 'g'), '1e6'));
            if (denominatorValue === Infinity) {
                return 0;
            }
            limitValue = math.evaluate(`limit(${f}, ${variable}, Infinity)`);
        } else if (point === '-Infinity') {
            const denominatorValue = math.evaluate(f.replace(new RegExp(variable, 'g'), '-1e6'));
            if (denominatorValue === Infinity) {
                return 0;
            }
            limitValue = math.evaluate(`limit(${f}, ${variable}, -Infinity)`);
        } else {
            // 分母が 0 の場合は計算しないで 0 を返す
            const denominatorValue = math.evaluate(f.replace(new RegExp(variable, 'g'), point));
            if (denominatorValue === 0) {
                return 0;
            }
            limitValue = math.evaluate(f, { [variable]: parseFloat(point) });
        }
        
        return math.round(limitValue, 3); // 小数第三位まで四捨五入
    } catch (error) {
        throw new Error("極限の計算に失敗しました。");
    }
}

function generateLatexExpression1(f, variable, point, limitValue) {
    let pointString = point === "Infinity" ? "\\infty" : point.toString();
    return `\\lim_{{${variable} \\to ${pointString}}} ${f} = ${limitValue}`;
}

function generateLatexExpression(f, g, variable, point, limitValue) {
    let pointString = point === "Infinity" ? "\\infty" : point.toString();
    return `\\lim_{{${variable} \\to ${pointString}}} \\frac{${f}}{${g}} = ${limitValue}`;
}

function applyLHopital(f, g, variable, point, maxIterations = 10) {
    let iteration = 0;
    let value = NaN;
    const pointValue = point === 'Infinity' ? 1e6 : parseFloat(point);

    while (iteration < maxIterations) {
        const f_value = math.evaluate(f, {
            [variable]: pointValue });
        const g_value = math.evaluate(g, {
            [variable]: pointValue });

        if (!math.isZero(g_value)) {
            value = math.divide(f_value, g_value);
            if (!math.isZero(value)) break;
        }

        f = math.derivative(f, variable).toString();
        g = math.derivative(g, variable).toString();
        iteration++;
    }

    return math.round(value, 3);
}

async function createLimitImage(latexString, client, title, description) {
    MathJax.config({ MathJax: {} });
    MathJax.start();
    const svg = await new Promise((resolve, reject) => {
        MathJax.typeset({
            math: latexString,
            format: "TeX",
            svg: true,
            scale: 2.5,
        }, (data) => {
            if (data.errors) reject(data.errors);
            else resolve(data.svg);
        });
    });

    const width = 300;
    const height = 100;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    const svgImage = await loadImage(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
    const xOffset = (width - svgImage.width) / 2;
    const yOffset = (height - svgImage.height) / 2;
    ctx.drawImage(svgImage, xOffset, yOffset);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'limit.png');
    const Embed = new MessageEmbed()
        .setColor(client.config.color)
        .setTitle(title)
        .setDescription(description)
        .setImage('attachment://limit.png')
        .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
        .setTimestamp()
        .setFooter({ text: '', iconURL: '' });

    return { embeds: [Embed], files: [attachment] };
}

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('極限を計算します。')
        .addStringOption(option =>
            option.setName('calculation_type')
            .setDescription('計算の種類を選択してください。')
            .setRequired(true)
            .addChoices({ name: '通常の極限計算', value: 'solve' }, { name: 'ロピタルの定理を使用した極限計算', value: 'lhopital' })
        )
        .addStringOption(option => option.setName('function')
            .setDescription('関数 f(x) を入力してください。例: sin(x)')
            .setRequired(true))
        .addStringOption(option => option.setName('variable')
            .setDescription('変数を指定してください。例: x')
            .setRequired(true))
        .addStringOption(option => option.setName('point')
            .setDescription('極限の点を指定してください。Infinityを指定することもできます。例: 0')
            .setRequired(true))
        .addStringOption(option => option.setName('function_g')
            .setDescription('分母の関数 g(x) を入力してください。例: x')
            .setRequired(false)),

    async execute(i, client) {
        await i.deferReply();
        const calculationType = i.options.getString('calculation_type');
        const f = i.options.getString('function').replace('^', '**');
        const variable = i.options.getString('variable');
        const point = i.options.getString('point');
        const g = i.options.getString('function_g');

        try {
            let limitValue, latexString, title;
            if (calculationType === "solve") {
                limitValue = calculateLimit(f.replace('^', '**'), variable, point);
                latexString = generateLatexExpression1(f, variable, point, limitValue);
                title = '極限計算';
            } else {
                limitValue = applyLHopital(f, g, variable, point);
                latexString = generateLatexExpression(f, g, variable, point, limitValue);
                title = 'ロピタルの定理による極限計算';
            }

            const description = `次の極限を計算しました：\nLaTeX: ${latexString}\n\n結果: ${limitValue}`;
            const response = await createLimitImage(latexString, client, title, description);
            await i.editReply(response);
        } catch (err) {
            await i.editReply("極限の計算に失敗しました。");
        }
    }
};
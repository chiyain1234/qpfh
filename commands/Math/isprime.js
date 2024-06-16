const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    if (num < 9) return true; // We have already excluded 4, 6 and 8.

    let k = 5;
    let l = Math.floor(Math.sqrt(num));
    while (k <= l) {
        if (num % k === 0 || num % (k + 2) === 0) return false;
        k += 6;
    }
    return true;
};

const isHappy = (num) => {
    const seen = new Set();
    const sumOfSquares = (n) => String(n).split('').reduce((sum, digit) => sum + digit * digit, 0);
    while (num !== 1 && !seen.has(num)) {
        seen.add(num);
        num = sumOfSquares(num);
    }
    return num === 1;
};

const isFibonacci = (num) => {
    const isPerfectSquare = (x) => {
        const s = Math.sqrt(x);
        return s * s === x;
    };
    return isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4);
};

const isLucas = (num) => {
    const lucas = [2, 1];
    while (lucas[lucas.length - 1] < num) {
        lucas.push(lucas[lucas.length - 1] + lucas[lucas.length - 2]);
    }
    return lucas.includes(num);
};

const isNarcissistic = (num) => {
    const digits = String(num).split('');
    const n = digits.length;
    return digits.reduce((sum, digit) => sum + Math.pow(digit, n), 0) === num;
};
const isMersenne = (num) => {
    const p = Math.log2(num + 1);
    return Number.isInteger(p) && isPrime(p);
};

const isKaprekar = (num) => {
    const square = (num ** 2).toString();
    const len = square.length;
    const left = parseInt(square.substring(0, len / 2)) || 0;
    const right = parseInt(square.substring(len / 2)) || 0;
    return left + right === num;
};

const hasTwinPrime = (num) => {
    return isPrime(num) && (isPrime(num - 2) || isPrime(num + 2));
};

const hasCousinPrime = (num) => {
    return isPrime(num) && (isPrime(num - 4) || isPrime(num + 4));
};

const hasSexyPrime = (num) => {
    return isPrime(num) && (isPrime(num - 6) || isPrime(num + 6));
};

const isSophieGermainPrime = (num) => {
    return isPrime(num) && isPrime(2 * num + 1);
};

const isSafePrime = (num) => {
    return isPrime(num) && isPrime((num - 1) / 2);
};

const isGolombPrime = (num) => {
    // グロタンディーク素数は57のみです
    return num === 57;
};

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('test')
        .setDescription('数の特定の数学的性質を判定します。')
        .addNumberOption(option =>
            option.setName('number')
                  .setDescription('判定する数字を入力してください。')
                  .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('type')
                  .setDescription('判定する数学的性質を選択してください。')
                  .setRequired(true)
                  .addChoices(
                      { name: 'ハッピー数', value: 'ishappy' },
                      { name: 'フィボナッチ数', value: 'isfibonacci' },
                      { name: 'リュカ数', value: 'islucas' },
                      { name: 'メルセンヌ数', value: 'ismersenne' },
                      { name: 'カプレカ数', value: 'isKaprekar' },
                      { name: 'ナルシシスト数', value: 'isnarcissistic' },
                      { name: '素数', value: 'isprime' },
                      { name: '双子素数', value: 'hastwinprime' },
                      { name: 'いとこ素数', value: 'hascousinprime' },
                      { name: 'セクシー素数', value: 'hassexyprime' },
                      { name: 'ソフィー・ジェルマン素数', value: 'issophiegermainprime' },
                      { name: '安全素数', value: 'issafeprime' },
                      { name: 'グロタンディーク素数', value: 'isgolombprime' },
                  )
        ),

    async execute(interaction, client) {
        const number = interaction.options.getNumber('number');
        const type = interaction.options.getString('type');
        let result;
        let description = '';

        switch (type) {
            case 'isprime':
                result = isPrime(number) ? `${number} は素数です。` : `${number} は素数ではありません。`;
                description = '素数（Prime number）は、1より大きく、1と自分自身以外の正の約数を持たない数です。';
                break;
            case 'ishappy':
                result = isHappy(number) ? `${number} はハッピー数です。` : `${number} はハッピー数ではありません。`;
                description = 'ハッピー数（Happy number）は、各桁の数の二乗の和を繰り返し計算して1に到達する数です。';
                break;
            case 'isfibonacci':
                result = isFibonacci(number) ? `${number} はフィボナッチ数です。` : `${number} はフィボナッチ数ではありません。`;
                description = 'フィボナッチ数（Fibonacci number）は、直前の2つの数の和で表される数の列です。';
                break;
            case 'islucas':
                result = isLucas(number) ? `${number} はリュカ数です。` : `${number} はリュカ数ではありません。`;
                description = 'リュカ数（Lucas number）は、特定の漸化式で表される数列です。';
                break;
            case 'issophiegermainprime':
                result = isSophieGermainPrime(number) ? `${number} はソフィー・ジェルマン素数です。` : `${number} はソフィー・ジェルマン素数ではありません。`;
                description = 'ソフィー・ジェルマン素数（Sophie Germain prime）は、素数 p に対して 2p + 1 も素数である数です。';
                break;
            case 'issafeprime':
                result = isSafePrime(number) ? `${number} は安全素数です。` : `${number} は安全素数ではありません。`;
                description = '安全素数（Safe prime）は、素数 p に対して (p - 1) / 2 も素数である数です。';
                break;
            case 'isnarcissistic':
                result = isNarcissistic(number) ? `${number} はナルシシスト数です。` : `${number} はナルシシスト数ではありません。`;
                description = 'ナルシシスト数（Narcissistic number）は、各桁の数をその桁の数の桁数乗で足し合わせた値が元の数と等しい数です。';
                break;
            case 'hastwinprime':
                result = hasTwinPrime(number) ? `${number} は双子素数を持ちます。` : `${number} は双子素数を持ちません。`;
                description = '双子素数（Twin prime）は、2つの素数が隣接している数の組です。';
                break;
            case 'hascousinprime':
                result = hasCousinPrime(number) ? `${number} はいとこ素数を持ちます。` : `${number} はいとこ素数を持ちません。`;
                description = 'いとこ素数（Cousin prime）は、2つの素数が4だけ離れている数の組です。';
                break;
            case 'hassexyprime':
                result = hasSexyPrime(number) ? `${number} はセクシー素数を持ちます。` : `${number} はセクシー素数を持ちません。`;
                description = 'セクシー素数（Sexy prime）は、2つの素数が6だけ離れている数の組です。';
                break;
            case 'isKaprekar':
                result = isKaprekar(number) ? `${number} はカプレカ数です。` : `${number} はカプレカ数ではありません。`;
                description = 'カプレカ数（Kaprekar number）は、その2乗を2つの数に分けた時、それらの和が元の数と等しくなる数です。';
                break;
            case 'ismersenne':
                result = isMersenne(number) ? `${number} はメルセンヌ数です。` : `${number} はメルセンヌ数ではありません。`;
                description = 'メルセンヌ数（Mersenne number）は、2のべき乗から1を引いた数です。';
                break;
            case 'isgolombprime':
                result = isGolombPrime(number) ? `${number} はグロタンディーク素数です。` : `${number} はグロタンディーク素数ではありません。`;
                description = 'グロタンディーク素数（Grothendieck prime）は、57だけです:D';
                break;
            default:
                result = '無効な選択肢です。';
                break;
        }

        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle('数学的性質の判定結果')
            .setDescription(result)
            .addFields({name: '数学的性質の説明', value: description})
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

        await interaction.deferReply();
        await interaction.editReply({ embeds: [Embed] });
    }
};
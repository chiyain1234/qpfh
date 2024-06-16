const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('equations')
        .setDescription('連立方程式を解く')
        .addStringOption(option =>
            option.setName('equations')
                .setDescription('連立方程式（係数と定数項をスペースで区切って入力、例：3 4 7, 1 -2 1）')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('decimalplaces')
                .setDescription('表示する小数点以下の桁数（0から10までの整数）')
                .setRequired(false)
                .setMaxValue(10)
                .setMinValue(1)),
    async execute(interaction, client) {
        const input = interaction.options.getString('equations');
        const decimalPlaces = interaction.options.getInteger('decimalplaces')||3
        const equations = input.split(',').map(eq => eq.trim().split(' ').map(Number));

        const coefficients = equations.map(eq => eq.slice(0, -1));
        const constants = equations.map(eq => eq.slice(-1)[0]);

        let solution;
        try {
            solution = math.lusolve(coefficients, constants);
        } catch (error) {
            await interaction.reply('方程式を解く際にエラーが発生しました。入力が正しいか確認してください。');
            return;
        }

        const variableNames = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const formattedSolution = solution.map((val, index) => {
            const decimal = decimalPlaces !== null ? val[0].toFixed(decimalPlaces) : val[0].toString();
            return `${variableNames[index]} = ${decimal}`;
        }).join('\n');

        const formattedEquations = equations.map(eq => 
            eq.slice(0, -1).map((coef, index) => `${coef}${variableNames[index]}`).join(' + ') + ` = ${eq.slice(-1)[0]}`
        ).join('\n');

        const embed = new MessageEmbed()
            .setTitle('連立方程式の解')
            .setDescription(`連立方程式:\n\`\`\`\n${formattedEquations}\n\`\`\`\n解:\n\`\`\`\n${formattedSolution}\n\`\`\``)
            .setColor(client.config.color)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });
            

        await interaction.reply({ embeds: [embed] });
    },
};
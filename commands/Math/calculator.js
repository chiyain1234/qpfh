const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } = require('discord.js');
const cmdName = "calculator";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("計算機を使う。"),

    async execute(i, client) {
        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setTitle("電卓")
            .setDescription(`\`\`\`0\`\`\``)
            .setTimestamp()
            .setFooter({ text: i.toString() });

        const buttons = [
            [{ id: 'calc7', label: '7', style: 'SECONDARY' }, { id: 'calc8', label: '8', style: 'SECONDARY' }, { id: 'calc9', label: '9', style: 'SECONDARY' }, { id: 'calcDEL', label: '⌫', style: 'DANGER' }, { id: 'calcAC', label: 'AC', style: 'DANGER' }],
            [{ id: 'calc4', label: '4', style: 'SECONDARY' }, { id: 'calc5', label: '5', style: 'SECONDARY' }, { id: 'calc6', label: '6', style: 'SECONDARY' }, { id: 'calc(', label: '(', style: 'PRIMARY' }, { id: 'calc)', label: ')', style: 'PRIMARY' }],
            [{ id: 'calc1', label: '1', style: 'SECONDARY' }, { id: 'calc2', label: '2', style: 'SECONDARY' }, { id: 'calc3', label: '3', style: 'SECONDARY' }, { id: 'calc×', label: '×', style: 'PRIMARY' }, { id: 'calc÷', label: '÷', style: 'PRIMARY' }],
            [{ id: 'calc.', label: '.', style: 'SECONDARY' }, { id: 'calc0', label: '0', style: 'SECONDARY' }, { id: 'calceq', label: '=', style: 'SUCCESS' }, { id: 'calc+', label: '+', style: 'PRIMARY' }, { id: 'calc-', label: '-', style: 'PRIMARY' }],
             ];

        const rows = buttons.map(row => {
            return new MessageActionRow().addComponents(row.map(button => {
                return new MessageButton().setCustomId(button.id).setLabel(button.label).setStyle(button.style);
            }));
        });
        const selectMenuRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('calcSelect')
                    .setPlaceholder('Factor')
                    .addOptions([
                        { label: ',', value: 'calccom' },
                        { label: 'π', value: 'calcpi' },
                        { label: 'e', value: 'calce' },
                        { label: 'i', value: 'calci' },
                        { label: '√', value: 'calcsqrt' },
                        { label: '^', value: 'calcP' },
                        { label: '!', value: 'calcf' },
                        { label: '°', value: 'calcdeg' },
                        { label: 'log', value: 'calclog' },
                        { label: 'sin', value: 'calcsin' },
                        { label: 'cos', value: 'calccos' },
                        { label: 'tan', value: 'calctan' },
                        { label: 'asin', value: 'calcasin' },
                        { label: 'acos', value: 'calcacos' },
                        { label: 'atan', value: 'calcatan' },
                        { label: 'sinh', value: 'calcsinh' },
                        { label: 'cosh', value: 'calccosh' },
                        { label: 'tanh', value: 'calctanh' },
                        { label: 'asinh', value: 'calcasinh' },
                        { label: 'acosh', value: 'calcacosh' },
                        { label: 'atanh', value: 'calcatanh' },
                        { label: 'sign', value: 'calcsign' }
                    ])
            );
              rows.push(selectMenuRow);
        await i.reply({ embeds: [embed], components: rows });
    }
};

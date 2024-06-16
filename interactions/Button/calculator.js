const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const math = require('mathjs');
const client = require('../../index.js');

client.on("interactionCreate", async (i) => {
    if (!i.isCommand() && !i.isButton() && !i.isSelectMenu()) return;

    const createButtonRow = (buttons) => new MessageActionRow().addComponents(buttons.map(btn => new MessageButton().setCustomId(btn.id).setLabel(btn.label).setStyle(btn.style)));
    const createSelectMenuRow = () => new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId('calcSelect').setPlaceholder('Factor')
        .addOptions([
            { label: ',', value: 'calccom' }, { label: 'π', value: 'calcpi' }, { label: 'e', value: 'calce' },
            { label: 'i', value: 'calci' }, { label: '√', value: 'calcsqrt' }, { label: '^', value: 'calcP' },
            { label: '!', value: 'calcf' }, { label: '°', value: 'calcdeg' }, { label: 'log', value: 'calclog' },
            { label: 'sin', value: 'calcsin' }, { label: 'cos', value: 'calccos' }, { label: 'tan', value: 'calctan' },
            { label: 'asin', value: 'calcasin' }, { label: 'acos', value: 'calcacos' }, { label: 'atan', value: 'calcatan' },
            { label: 'sinh', value: 'calcsinh' }, { label: 'cosh', value: 'calccosh' }, { label: 'tanh', value: 'calctanh' },
            { label: 'asinh', value: 'calcasinh' }, { label: 'acosh', value: 'calcacosh' }, { label: 'atanh', value: 'calcatanh' },
            { label: 'sign', value: 'calcsign' }
        ]));

    const buttons = [
        [{ id: 'calc7', label: '7', style: 'SECONDARY' }, { id: 'calc8', label: '8', style: 'SECONDARY' }, { id: 'calc9', label: '9', style: 'SECONDARY' }, { id: 'calcDEL', label: '⌫', style: 'DANGER' }, { id: 'calcAC', label: 'AC', style: 'DANGER' }],
        [{ id: 'calc4', label: '4', style: 'SECONDARY' }, { id: 'calc5', label: '5', style: 'SECONDARY' }, { id: 'calc6', label: '6', style: 'SECONDARY' }, { id: 'calc(', label: '(', style: 'PRIMARY' }, { id: 'calc)', label: ')', style: 'PRIMARY' }],
        [{ id: 'calc1', label: '1', style: 'SECONDARY' }, { id: 'calc2', label: '2', style: 'SECONDARY' }, { id: 'calc3', label: '3', style: 'SECONDARY' }, { id: 'calc×', label: '×', style: 'PRIMARY' }, { id: 'calc÷', label: '÷', style: 'PRIMARY' }],
        [{ id: 'calc.', label: '.', style: 'SECONDARY' }, { id: 'calc0', label: '0', style: 'SECONDARY' }, { id: 'calceq', label: '=', style: 'SUCCESS' }, { id: 'calc+', label: '+', style: 'PRIMARY' }, { id: 'calc-', label: '-', style: 'PRIMARY' }],
    ];

    const rows = [...buttons.map(createButtonRow), createSelectMenuRow()];

    const updateEmbed = async (i, formula) => {
        const msg = await i.channel.messages.fetch(i.message.id);
        await i.deferUpdate();
        const embed = new MessageEmbed()
            .setColor(msg.embeds[0].color)
            .setAuthor(msg.embeds[0].author)
            .setTitle("電卓")
            .setDescription(`\`\`\`${formula}\`\`\``)
            .setTimestamp()
            .setFooter(msg.embeds[0].footer);

        await msg.edit({ embeds: [embed], components: rows });
    };

    const handleButton = async (i, char) => {
        const msg = await i.channel.messages.fetch(i.message.id);
        let formula = msg.embeds[0].description.replace(/```/g, "");
        if (formula === "0" && char !== ".") formula = "";
        await updateEmbed(i, formula + char);
    };

    const handlers = {
        calcAC: (i) => updateEmbed(i, "0"),
        calcDEL: async (i) => {
            const msg = await i.channel.messages.fetch(i.message.id);
            let formula = msg.embeds[0].description.replace(/```/g, "").slice(0, -1) || "0";
            await updateEmbed(i, formula);
        },
        calceq: async (i) => {
            const msg = await i.channel.messages.fetch(i.message.id);
            let formula = msg.embeds[0].description.replace(/```/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/√/g, "sqrt").replace(/π/g, "pi").replace(/°/g, "deg");
            try {
                let result = math.evaluate(formula);
                await updateEmbed(i, `${formula.replace(/sqrt/g, '√').replace(/pi/g, 'π').replace(/\*/g, '×').replace(/\//g, '÷').replace(/deg/g, '°')}=${result}`);
            } catch {
                await updateEmbed(i, "ERROR!");
            }
        },
    };

    "1234567890×÷-+().".split("").forEach(char => {
        handlers[`calc${char}`] = (i) => handleButton(i, char);
    });

const selectHandlers = {};
[
    { key: 'calcpi', value: 'π' },
    { key: 'calce', value: 'e' },
    { key: 'calci', value: 'i' },
    { key: 'calcP', value: '^' },
    { key: 'calcsqrt', value: '√(' },
    { key: 'calcdeg', value: '°' },
    { key: 'calcf', value: '!' },
    { key: 'calclog', value: 'log(' },
    { key: 'calcsin', value: 'sin(' },
    { key: 'calccos', value: 'cos(' },
    { key: 'calctan', value: 'tan(' },
    { key: 'calcsinh', value: 'sinh(' },
    { key: 'calccosh', value: 'cosh(' },
    { key: 'calctanh', value: 'tanh(' },
    { key: 'calcasin', value: 'asin(' },
    { key: 'calcacos', value: 'acos(' },
    { key: 'calcatan', value: 'atan(' },
    { key: 'calcasinh', value: 'asinh(' },
    { key: 'calcacosh', value: 'acosh(' },
    { key: 'calcatanh', value: 'atanh(' },
    { key: 'calcsign', value: 'sign(' },
    { key: 'calccom', value: ',' }
].forEach(item => {
    selectHandlers[item.key] = (i) => handleButton(i, item.value);
});

    if (i.isButton() && handlers[i.customId]) {
        handlers[i.customId](i);
    } else if (i.isSelectMenu() && selectHandlers[i.values[0]]) {
        selectHandlers[i.values[0]](i);
    }
});

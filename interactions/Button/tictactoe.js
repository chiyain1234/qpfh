const client = require('../../index.js')
const config = require("../../config.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const winConditions = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]
];

client.on("interactionCreate", async (i) => {
  
    if ((["ttt_1", "ttt_2", "ttt_3", "ttt_4", "ttt_5", "ttt_6", "ttt_7", "ttt_8", "ttt_9"]).includes(i.customId)) {
        let message = await i.channel.messages.fetch(i.message.id);
        const rows = message.components;
        const buttonIndex = parseInt(i.customId.split("_")[1]) - 1;
        let updatedButtons = rows.flatMap(row => row.components.map(button => ({
            id: button.customId,
            label: button.label,
            disabled: button.disabled,
            style: button.style
        })));

        updatedButtons[buttonIndex] = {
            id: updatedButtons[buttonIndex].id,
            label: "〇",
            disabled: true,
            style: "SUCCESS"
        };

        const actionRows = [];
        for (let i = 0; i < 3; i++) {
            const actionRow = new MessageActionRow()
                .addComponents(
                    updatedButtons.slice(i * 3, (i + 1) * 3).map(button => new MessageButton()
                        .setCustomId(button.id)
                        .setLabel(button.label)
                        .setDisabled(true)
                        .setStyle(button.style)
                    )
                );
            actionRows.push(actionRow);
        }

        await i.deferUpdate();
        const embed = new MessageEmbed()
            .setColor(config.color)
            .setAuthor({ name: message.embeds[0].author.name, iconURL: message.embeds[0].author.iconURL })
            .setTitle("〇×ゲーム")
            .setTimestamp()
            .setFooter({ text: message.embeds[0].footer.text });
        await message.edit({ embeds: [embed], components: actionRows });
    }

    if ((["ttt_1", "ttt_2", "ttt_3", "ttt_4", "ttt_5", "ttt_6", "ttt_7", "ttt_8", "ttt_9"]).includes(i.customId)) {
        setTimeout(async () => {
            let message = await i.channel.messages.fetch(i.message.id);
            const rows = message.components;

            const ttt = [];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    ttt.push(rows[i]?.components[j]);
                }
            }
            let updatedButtons = [];
            for (let i = 0; i < 9; i++) {
                updatedButtons.push({
                    id: `ttt_${i + 1}`,
                    label: rows[Math.floor(i / 3)]?.components[i % 3]?.label,
                    disabled: rows[Math.floor(i / 3)]?.components[i % 3]?.disabled,
                    style: rows[Math.floor(i / 3)]?.components[i % 3]?.style
                });
            }

            let win = false;
            for (const condition of winConditions) {
                if (condition.every(index => updatedButtons[index]?.style === "SUCCESS")) {
                    win = true;
                    break;
                }
            }

            if (win) {
                const actionRows = [];
                for (let i = 0; i < 3; i++) {
                    const buttons = [];
                    for (let j = 0; j < 3; j++) {
                        buttons.push(
                            new MessageButton()
                                .setCustomId(updatedButtons[i * 3 + j].id)
                                .setLabel(updatedButtons[i * 3 + j].label)
                                .setDisabled(true)
                                .setStyle(updatedButtons[i * 3 + j].style)
                        );
                    }
                    actionRows.push(new MessageActionRow().addComponents(...buttons));
                }

                const embed = new MessageEmbed()
                    .setColor(config.color)
                    .setAuthor({ name: message.embeds[0].author.name, iconURL: message.embeds[0].author.iconURL, url: '' })
                    .setTitle("〇×ゲーム | 終了！")
                    .setDescription("〇の勝ち！")
                    .setTimestamp()
                    .setFooter({ text: message.embeds[0].footer.text, iconURL: '' });

                await message.edit({ embeds: [embed], components: actionRows });
            } else {
                const enabledButtons = [];
                rows.forEach(row => {
                    row.components.forEach(button => {
                        if (button.style === "SECONDARY") {
                            enabledButtons.push(button);
                        }
                    });
                });

                var randomButton = enabledButtons[Math.floor(Math.random() * enabledButtons.length)];
                if (randomButton) {
                    const updateButton = (button, updatedButton) => {
                        button.setCustomId(updatedButton.id)
                            .setLabel(updatedButton.label)
                            .setDisabled(updatedButton.style === "SECONDARY" ? false : updatedButton.disabled)
                            .setStyle(updatedButton.style);
                    };

                    const checkWinCondition = (updatedButtons) => {
                        const dangerConditions = [
                            ["DANGER", "DANGER", "DANGER"],
                            ["DANGER", null, null],
                            [null, null, "DANGER"]
                        ];

                        for (const condition of dangerConditions) {
                            const [style1, style2, style3] = condition;
                            const indexes = [updatedButtons.findIndex(button => button.style === style1),
                            updatedButtons.findIndex(button => button.style === style2),
                            updatedButtons.findIndex(button => button.style === style3)
                            ];

                            if (indexes.every(index => index !== -1)) {
                                const [i, j, k] = indexes;
                                if (i - j === 1 && j - k === 1) {
                                    return [i, j, k];
                                }
                            }
                        }
                        return null;
                    };

                    const embedBase = new MessageEmbed()
                        .setColor(config.color)
                        .setAuthor({ name: message.embeds[0].author.name, iconURL: message.embeds[0].author.iconURL, url: '' })
                        .setTitle("〇×ゲーム")
                        .setTimestamp()
                        .setFooter({ text: message.embeds[0].footer.text, iconURL: '' });

                    const createButton = (id, label, style, disabled) => {
                        return new MessageButton()
                            .setCustomId(id)
                            .setLabel(label)
                            .setDisabled(style === "SECONDARY" ? false : disabled)
                            .setStyle(style);
                    };

                    const updateButtons = (buttons) => {
                        return buttons.map(button => createButton(button.id, button.label, button.style, button.disabled));
                    };

                    const checkWinConditions = (buttons) => {
                        for (const combo of winConditions) {
                            const [a, b, c] = combo;
                            if (buttons[a].style === "DANGER" && buttons[a].style === buttons[b].style && buttons[b].style === buttons[c].style) {
                                return true;
                            }
                        }
                        return false;
                    };

                    const updateGame = async (buttons) => {
                        const actionRows = [
                            new MessageActionRow().addComponents(...buttons.slice(0, 3)),
                            new MessageActionRow().addComponents(...buttons.slice(3, 6)),
                            new MessageActionRow().addComponents(...buttons.slice(6, 9))
                        ];
                        const embed = embedBase;
                        await message.edit({ embeds: [embed], components: actionRows });

                        if (checkWinConditions(buttons)) {
                            for (const row of actionRows) {
                                for (const button of row.components) {
                                    button.setDisabled(true);
                                }
                            }

                            const endEmbed = new MessageEmbed()
                                .setColor(config.color)
                                .setAuthor({ name: message.embeds[0].author.name, iconURL: message.embeds[0].author.iconURL, url: '' })
                                .setTitle("〇×ゲーム | 終了！")
                                .setDescription("×の勝ち！")
                                .setTimestamp()
                                .setFooter({ text: message.embeds[0].footer.text, iconURL: '' });
                            await message.edit({ embeds: [endEmbed], components: actionRows });
                        }
                    };

                    if (randomButton.customId.startsWith("ttt_")) {
                        const index = parseInt(randomButton.customId.split("_")[1]) - 1;
                        updatedButtons[index].label = "×";
                        updatedButtons[index].style = "DANGER";
                        updatedButtons[index].disabled = true;
                        await updateGame(updateButtons(updatedButtons));
                    }
                }
            }
        }, 1000)
    }
})
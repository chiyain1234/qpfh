const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('slot')
        .setDescription('スロットを回します'),

    async execute(interaction, client) {
        const symbols = ['🍒', '🍋', '🍉', '⭐', '🔔', '7️⃣'];
        const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

        const slot1 = getRandomSymbol();
        const slot2 = getRandomSymbol();
        const slot3 = getRandomSymbol();

        const result = (slot1 === slot2 && slot2 === slot3) ? 'Jackpot!' : 'Try Again!';

        const embed = new MessageEmbed()
            .setTitle('スロットマシン')
            .setDescription(`**${slot1} | ${slot2} | ${slot3}**\n${result}`)
            .setColor(client.config.color)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    }
};

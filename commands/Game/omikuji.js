const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
	cooldown: 5,
    data: new SlashCommandSubcommandBuilder() 
        .setName('omikuji')
        .setDescription('おみくじを引きます。')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ユーザーを選択してください')
                .setRequired(false)),

    async execute(interaction, client) {
        const user = interaction.options.getUser('target') || interaction.user;
        const userId = user.id;
        const last4Digits = userId.slice(-4);

        const seed = (new Date().getDate() + last4Digits.slice(0, 10)).replace(/-/g, '');
        const seeder = Number(seed / last4Digits * new Date().getDay());
        const fortunes = [
            { result: "大吉", chance: 10 },
            { result: "中吉", chance: 15 },
            { result: "小吉", chance: 20 },
            { result: "吉", chance: 20 },
            { result: "末吉", chance: 15 },
            { result: "凶", chance: 15 },
            { result: "大凶", chance: 5 }
        ];

        let randomValue = parseInt(seeder, 36) % 100;

        let chosenFortune;
        for (const fortune of fortunes) {
            if (randomValue < fortune.chance) {
                chosenFortune = fortune;
                break;
            }
            randomValue -= fortune.chance;
        }

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle('おみくじ')
            .setDescription(`${user.username} の今日の運勢は... **${chosenFortune.result}**`)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.reply({ embeds: [embed] });
    }
};

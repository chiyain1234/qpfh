const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
	cooldown: 5,
    data: new SlashCommandSubcommandBuilder()
    .setName("french_rpc")
    .setDescription("フランス式じゃんけんをする。")
    .addStringOption(option => option
        .setName('choice')
        .setDescription('手を選択してください。')
        .setRequired(true)
        .addChoices({ name: '✊ ピエール', value: 'pierre' }, { name: '✌️ シゾー', value: 'ciseaux' }, { name: '✋ フェイユ', value: 'feuille' }, { name: '🤌 ピュイ', value: 'puits' })),

    async execute(i, client) {
        const choice = i.options.getString('choice');
        const handEmojis = {
            pierre: '✊',
            ciseaux: '✌️',
            feuille: '✋',
            puits: '🤌'
        };
        const userChoice = handEmojis[choice];

        const weightedChoices = [
            ...Array(8).fill('✊'),
            ...Array(9).fill('✌️'),
            ...Array(10).fill('✋'),
            ...Array(10).fill('🤌')
        ];
        const botChoice = weightedChoices[Math.floor(Math.random() * weightedChoices.length)];
        let result;
        if (userChoice === botChoice) {
            result = "あいこです！";
        } else if (
            (userChoice === '✊' && botChoice === '✌️') ||
            (userChoice === '✋' && (botChoice === '✊' || botChoice === '🤌')) ||
            (userChoice === '✌️' && botChoice === '✋') ||
            (userChoice === '🤌' && (botChoice === '✊' || botChoice === '✌️'))
        ) {
            result = 'あなたの勝ちです！(^▽^)/';
        } else {
            result = 'あなたの負けです！';
        }
        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor({
                name: `${client.user.tag}`,
                iconURL: `${client.user.displayAvatarURL()}`,
                url: ''
            })
            .setTitle('フランスじゃんけんぽい')
            .addFields({ name: "あなた", value: `${userChoice}`, inline: true }, { name: "TanTanBot", value: `${botChoice}`, inline: true }, { name: "結果", value: result })
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });
        await i.reply({ embeds: [Embed] });
    }
};

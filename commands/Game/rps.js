const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const cmdName = "rps";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
	cooldown: 5,
    data: new SlashCommandSubcommandBuilder()
    .setName("rpc")
    .setDescription("ボットとじゃんけんをする。")
    .addStringOption(option => option
        .setName('choice')
        .setDescription('手を選択してください。')
        .setRequired(true)
        .addChoices({ name: '✊ グー', value: 'rock' }, { name: '✌️ チョキ', value: 'scissors' }, { name: '✋ パー', value: 'paper' }, )),

    async execute(i, client) {
        const choice = i.options.getString('choice');
            const handEmojis = {
                rock: '✊',
                scissors: '✌️',
                paper: '✋'
            };
            const userChoice = handEmojis[choice];
            const choices = ['✊', '✋', '✌️'];
            const botChoice = choices[Math.floor(Math.random() * choices.length)];

            let result;
            if (userChoice === botChoice) {
                result = "あいこです！";
            } else if (
                (userChoice === '✊' && botChoice === '✌️') ||
                (userChoice === '✋' && botChoice === '✊') ||
                (userChoice === '✌️' && botChoice === '✋')
            ) {
                result = 'あなたの勝ちです！(^▽^)/';
            } else {
                result = 'あなたの負けです！(^▽^)/';
            }

            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
                .setTitle(`じゃんけんぽい`)
                .addFields({ name: "あなた", value: `${userChoice}`, inline: true })
                .addFields({ name: "TanTanBot", value: `${botChoice}`, inline: true })
                .addFields({ name: "結果", value: result })
                .setTimestamp()
                .setFooter({ text: i.toString(), iconURL: '' });
            await i.reply({ embeds: [Embed] })
        }
};

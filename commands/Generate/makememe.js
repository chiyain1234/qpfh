const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require('discord.js');

const cmdName = "meme";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 15,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("ミーム画像を作成する。")
        .addStringOption(option => option
            .setName('type')
            .setDescription('画像タイプを選択してください。')
            .setRequired(true)
            .addChoices(
                { name: 'Aag', value: 'aag' },
                { name: 'Afraid', value: 'afraid' },
                { name: 'Buzz', value: 'buzz' },
                { name: 'Boat', value: 'boat' },
                { name: 'Cake', value: 'cake' },
                { name: 'Captain', value: 'captain' },
                { name: 'Cbg', value: 'cbg' },
                { name: 'Crazypills', value: 'crazypills' },
                { name: 'Drunk', value: 'drunk' },
                { name: 'Doge', value: 'doge' },
                { name: 'Elmo', value: 'elmo' },
                { name: 'Exit', value: 'exit' },
                { name: 'Facepalm', value: 'facepalm' },
                { name: 'Home', value: 'home' },
                { name: 'Michael-scott', value: 'michael-scott' },
                { name: 'Right', value: 'right' },
                { name: 'Rollsafe', value: 'rollsafe' },
                { name: 'Say', value: 'say' },
                { name: 'Seagull', value: 'seagull' },
                { name: 'Stonks', value: 'stonks' },
                { name: 'Tried', value: 'tried' },
                { name: 'Trump', value: 'trump' },
                { name: 'Wishes', value: 'wishes' },
                { name: 'Woman-cat', value: 'woman-cat' },
            ))
        .addStringOption(option => option
            .setName('text')
            .setDescription('文字を入力してください。')
            .setRequired(true)),

    async execute(i, client) {
        const text = i.options.getString('text');
        const type = i.options.getString('type');
        const uri = `https://api.memegen.link/images/${type}/${text}`;
		const image = encodeURI(uri);

        const attachment = new MessageAttachment(image, 'memes.png');
        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`${text}`)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setImage('attachment://memes.png')
            .setTimestamp()
            .setFooter({ text: interaction.toString() });

        await i.deferReply();
        return i.editReply({ embeds: [Embed], files: [attachment] });
    }
};

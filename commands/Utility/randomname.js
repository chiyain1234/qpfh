const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('randomname')
        .setDescription('指定された文字数でランダムな名前を生成します')
        .addIntegerOption(option => 
            option.setName('value')
                .setDescription('生成する名前の文字数')
                .setRequired(false)),

    async execute(interaction, client) {
        const num = Math.floor(Math.random() * 10) + 1;
        const length = interaction.options.getInteger('value')||num;

        const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
        const dakuten = 'がぎぐげござじずぜぞだぢづでどばびぶべぼ';
        const handakuten = 'ぱぴぷぺぽ';
        const smallChars = 'ぁぃぅぇぉっゃゅょ';

        const allChars = hiragana + dakuten + handakuten + smallChars;


        let randomName = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            randomName += allChars[randomIndex];
        }

        const embed = new MessageEmbed()
            .setTitle('ランダム名前生成')
            .setDescription(`生成された名前: **${randomName}**`)
            .setColor(client.config.color)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setTimestamp()
            .setFooter({ text: interaction.toString(), iconURL: '' });

        await interaction.reply({ embeds: [embed] });
    }
};

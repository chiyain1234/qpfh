const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const axios = require('axios');

const cmdName = "httpcat";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
	cooldown: 15,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("Httpのステータスコードに対応する猫画像を表示する。")
        .addNumberOption(option => option.setName('number')
            .setDescription('数字を入力してください。')
            .setMinValue(100)
            .setMaxValue(999)
            .setRequired(true)),

    async execute(i, client) {
        await i.deferReply();
        try {
            const number = i.options.getNumber('number');
            const imageUrl = `https://http.cat/${number}`;
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const attachment = new MessageAttachment(response.data, 'http.png');
            
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`${number}`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setImage('attachment://http.png')
                .setTimestamp()
                .setFooter({ text: i.toString() });

            return i.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            let errorMessage;
            if (error.response && error.response.status === 404) {
                errorMessage = '指定されたステータスコードに対応する猫画像が見つかりませんでした。';
            } else {
                errorMessage = '画像の取得中にエラーが発生しました。もう一度お試しください。';
            }

            return i.editReply({ content: errorMessage });
        }
    }
};

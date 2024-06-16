const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const axios = require('axios');

const cmdName = "5000cho";

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
	cooldown: 15,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("5000兆円ジェネレーターを生成する。")
        .addStringOption(option => option.setName('top')
            .setDescription('文字を入力してください。')
            .setRequired(true))
        .addStringOption(option => option
            .setName('bottom')
            .setDescription('テキストを入力してください。')
            .setRequired(false))
        .addStringOption(option => option
            .setName('background')
            .setDescription('背景を白色にするかどうか。')
            .setRequired(false)
            .addChoices({ name: 'True', value: 'true' }, { name: 'False', value: 'false' }))
        .addStringOption(option => option
            .setName('rainbow')
            .setDescription('文字の色を虹色にするかどうか。')
            .setRequired(false)
            .addChoices({ name: 'True', value: 'true' }, { name: 'False', value: 'false' })),

    async execute(i, client) {
        try {
            const top = i.options.getString('top');
            const bottom = i.options.getString('bottom');
            const rainbow = i.options.getString('rainbow') === "true" ? 'rainbow=true' : 'rainbow=false';
            const background = i.options.getString('background') === "true" ? 'noalpha=true' : 'noalpha=false';

            let dd;
            if (bottom === null) {
                dd = `https://gsapi.cbrx.io/image?top=${top}&${background}&${rainbow}&single=true`;
            } else {
                dd = `https://gsapi.cbrx.io/image?top=${top}&bottom=${bottom}&${background}&${rainbow}`;
            }

            const image = encodeURI(dd);

            const Embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`5000兆円ジェネレーター`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setImage('attachment://5000.png')
                .setTimestamp()
                .setFooter({ text: `/${cmdName}`, iconURL: '' });

            await i.deferReply();

            const response = await axios.get(image, { responseType: 'arraybuffer' });
            const attachment = new MessageAttachment(response.data, '5000.png');

            return i.editReply({ embeds: [Embed], files: [attachment] });
        } catch (error) {
            console.error('Error generating image:', error);
            return i.editReply({ content: '画像生成中にエラーが発生しました。もう一度お試しください。' });
        }
    }
};

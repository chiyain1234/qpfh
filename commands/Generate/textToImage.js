const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');

const cmdName = 'text2image';

const typeMap = {
    'glow': 'glow-logo',
    'alien': 'alien-glow-logo',
    'steel': 'steel-logo',
    'electric': 'electric',
    'chrom': 'chrominium-logo',
    'scribble': 'scribble-logo',
    'kryptonite': 'kryptonite-logo',
    'lava': 'lava-logo',
    'disco': 'disco-party-logo',
    'glass': 'glass-logo',
    'husky': 'husky-logo',
    'fluffy': 'fluffy-logo',
    'water': 'water-logo',
    'harry': 'harry-potter-logo',
    'twitter': 'birdy-logo',
    'starwars': 'star-wars-logo',
    'dance': 'dance-logo',
    'frozen': 'frozen-logo',
    'neon': 'neon-logo',
    'smurfs': 'smurfs-logo',
    'clan': 'clan-logo',
    'matrix': 'matrix-logo',
    'sugar': 'sugar-logo',
    'monsoon': 'monsoon-logo'
};

const fontMap = {
    'default': '&',
    'mincho': '&fontname=mincho',
    'impact': '&fontname=impact',
    'american-text': '&fontname=american+text',
    'bullpen-3d': '&fontname=bullpen+3d',
    'zwisdom': '&fontname=zwisdom',
    'bizarre': '&fontname=bizarre',
    'kinkie': '&fontname=kinkie',
    'kingscross': '&fontname=kingscross',
    'freebooter': '&fontname=freebooter+script',
    'bloodlust': '&fontname=bloodlust',
    'starbats': '&fontname=starbats',
    'action-is-jl': '&fontname=action+is+jl',
    'election-day': '&fontname=election+day',
    'capri': '&fontname=capri',
    'husky-stash': '&fontname=husky+stash',
    'fatboysmiles': '&fontname=FatBoySmiles',
    'monoton': '&fontname=monoton',
    'cinzel-decorative': '&fontname=decorative',
    'cretino': '&fontname=cretino',
    'planet-X': '&fontname=planet+X',
    'paytone-one': '&fontname=party+one',
    'cinzel': '&fontname=cinzel',
    'linquidism': '&fontname=linquidism',
    'cooper': '&fontname=cooper'
};

const backgroundMap = {
    'default': '&',
    'rain': '&backgroundRadio=2&backgroundPattern=Rain',
    'pastel-stuff': '&backgroundRadio=2&backgroundPattern=Pastel+Stuff',
    'leaves': '&backgroundRadio=2&backgroundPattern=Leaves+6',
    'pastel-rainbow': '&backgroundRadio=3&backgroundGradient=Pastel+Rainbow',
    'amethyst': '&backgroundRadio=2&backgroundPattern=Amethyst',
    'multicolor': '&backgroundRadio=3',
    'bricks': '&backgroundRadio=2&backgroundPattern=Bricks',
    'ice': '&backgroundRadio=2&backgroundPattern=Ice',
    'lightning': '&backgroundRadio=2&backgroundPattern=Lightning',
    'warning': '&backgroundRadio=2&backgroundPattern=Warning!',
    'weave': '&backgroundRadio=2&backgroundPattern=3D+weave',
    'grid': '&backgroundRadio=2&backgroundPattern=Blue+Grid',
    'colorful': '&backgroundRadio=2&backgroundPattern=Colorful+Whirl',
    'rainbow': '&backgroundRadio=3&backgroundPattern=Parque+%231',
    'golden': '&backgroundRadio=3&backgroundPattern=Parque+%231&backgroundGradient=Golden',
    'pride': '&backgroundRadio=3&backgroundPattern=Parque+%231&backgroundGradient=Pride',
    'blue-green': '&backgroundRadio=3&backgroundPattern=Parque+%231&backgroundGradient=Blue+Green',
    'deep-sea': '&backgroundRadio=3&backgroundPattern=Parque+%231&backgroundGradient=Deep+Sea',
    'transparent': '&backgroundRadio=0'
};

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
	cooldown: 15,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription('テキストを画像にする。')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('画像タイプを選択してください。')
                .setRequired(true)
                .addChoices(...Object.keys(typeMap).map(key => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value: key }))))
        .addStringOption(option =>
            option.setName('font')
                .setDescription('フォントを選択してください。')
                .setRequired(true)
                .addChoices(...Object.keys(fontMap).map(key => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value: key }))))
        .addStringOption(option =>
            option.setName('background')
                .setDescription('背景を選択してください。')
                .setRequired(true)
                .addChoices(...Object.keys(backgroundMap).map(key => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value: key }))))
        .addStringOption(option => option.setName('text').setDescription('文字を入力してください。').setRequired(true)),

    async execute(i, client) {
        const type = i.options.getString('type');
        const font = i.options.getString('font');
        const background = i.options.getString('background');
        const text = i.options.getString('text');

        const form = typeMap[type];
        const fontname = fontMap[font];
        const backgroundValue = backgroundMap[background];

        const uri = `https://flamingtext.com/net-fu/proxy_form.cgi?script=${form}&text=${text}&_loc=generate&imageoutput=true${fontname}${backgroundValue}`;
        const image = encodeURI(uri);

        const embed = new MessageEmbed()
			.setColor(client.config.color)
			.setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setDescription(`${type}`)
            .setImage('attachment://text2img.png')
            .setTimestamp()
            .setFooter({ text: i.toString(), iconURL: '' });

        await i.deferReply();

        const attachment = new MessageAttachment(image, 'text2img.png');
        await i.editReply({ embeds: [embed], files: [attachment] });
    }
};

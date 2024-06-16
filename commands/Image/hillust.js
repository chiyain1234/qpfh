const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const booru = require('booru');
const cmdName = "hillust";

const subcommandData1 = {
    "fellatio": { name: "fellatio", word: "fellatio" },
    "panties": { name: "panties", word: "panties" },
    "ahegao": { name: "ahegao", word: "ahegao" },
    "ass": { name: "ass", word: "ass" },
    "swimsuit": { name: "swimsuit", word: "swimsuit" },
    "furry": { name: "furry", word: "furry" },
    "futanari": { name: "futanari", word: "futanari" },
    "incest": { name: "incest", word: "incest" },
    "maid": { name: "maid", word: "maid" },
    "pussy": { name: "pussy", word: "pussy" },
    "masturbation": { name: "masturbation", word: "masturbation" },
    "uniform": { name: "uniform", word: "uniform" },
    "yuri": { name: "yuri", word: "yuri" },
    "anal": { name: "anal", word: "anal" },
    "orgy": { name: "orgy", word: "orgy" },
    "paizuri": { name: "paizuri", word: "paizuri" },
    "cum": { name: "cum", word: "cum" },
    "nakadashi": { name: "nakadashi", word: "cum_in_pussy" },
    "footjob": { name: "footjob", word: "footjob" },
    "femdom": { name: "femdom", word: "femdom" },
    "handjob": { name: "handjob", word: "handjob" },
    "behind": { name: "sex_from_behind", word: "sex_from_behind" },
    "succubus": { name: "succubus", word: "succubus" },
    "gangbang": { name: "gangbang", word: "gangbang" },
    "tentacle": { name: "tentacle", word: "tentacle_sex" },
};

const subcommandData2 = {
    "fellatio": { name: "fellatio", word: "fellatio" },
    "ahegao": { name: "ahegao", word: "ahegao" },
    "ass": { name: "ass", word: "ass" },
    "pussy": { name: "pussy", word: "pussy" },
    "masturbation": { name: "masturbation", word: "masturbation" },
    "yuri": { name: "yuri", word: "yuri" },
    "anal": { name: "anal", word: "anal" },
    "orgy": { name: "orgy", word: "orgy" },
    "paizuri": { name: "paizuri", word: "paizuri" },
    "cum": { name: "cum", word: "cum" },
    "nakadashi": { name: "nakadashi", word: "creampie" },
    "footjob": { name: "footjob", word: "footjob" },
    "femdom": { name: "femdom", word: "femdom" },
    "handjob": { name: "handjob", word: "handjob" },
    "behind": { name: "sex_from_behind", word: "sex_from_behind" },
    "cosplay": { name: "cosplay", word: "cosplay" },
    "gangbang": { name: "gangbang", word: "gangbang" },
    "thighhighs": { name: "thighhighs", word: "thighhighs" },
    "boobs": { name: "boobs", word: "boobs" },
    "fisting": { name: "fisting", word: "fisting" },
    "goth": { name: "goth", word: "goth" },
    "petite": { name: "petite", word: "petite" },
    "interracial": { name: "interracial", word: "interracial" },
    "vaginal": { name: "vaginal_sex", word: "vaginal_sex" },
    "doggystyle": { name: "doggystyle", word: "doggystyle" },
};

const commandBuilder = new SlashCommandBuilder()
    .setName(cmdName)
    .setDescription("Hな画像を取得する。")
    .setNSFW(true)
    .addSubcommandGroup(group => {
        const animeGroup = group
            .setName('anime')
            .setDescription('2Dの画像を取得する。');
        
        for (const [key, { name }] of Object.entries(subcommandData1)) {
            animeGroup.addSubcommand(subcommand =>
                subcommand
                    .setName(key)
                    .setDescription(`${name}の画像を表示する。`)
            );
        }
        return animeGroup;
    })
    .addSubcommandGroup(group => {
        const rialGroup = group
            .setName('real')
            .setDescription('リアルの画像を取得する。');
        
        for (const [key, { name }] of Object.entries(subcommandData2)) {
            rialGroup.addSubcommand(subcommand =>
                subcommand
                    .setName(key)
                    .setDescription(`${name}の画像を表示する。`)
            );
        }
        return rialGroup;
    });


module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 8,
    data: commandBuilder,

    async execute(interaction, client) {
        await interaction.deferReply();
        try{
        const subcommand = interaction.options.getSubcommand();
        const nsfw = interaction.options.getBoolean('nsfw') || false;
        const group = interaction.options.getSubcommandGroup();
        const cmd = group === 'anime' ? subcommandData1 :
            subcommandData2;
        const { name, word } = cmd[subcommand] || {};
        
        const database = group === 'anime' ? "db" : "rb";

        if (word) {
            booru.search(database, [word], { nsfw: true, random: true }).then(images => {
                if (images.length > 0) {
                    const image = images[0].file_url;
            if(database === "rb"){
                     interaction.editReply(image);
            }
            if(database === "db"){
                const attachment = new MessageAttachment(image, 'hillust.png');
                const embed = new MessageEmbed()
                    .setColor(client.config.color)
                    .setTitle(`${name}`)
                    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
                    .setImage('attachment://hillust.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.toString(), iconURL: '' });
        
                 interaction.editReply({ embeds: [embed], files: [attachment]  });
            }
                } else {
                    interaction.editReply("画像が見つかりませんでした。\nもう一度お試しください。");
                }
            }).catch(error => {
                console.error('Error searching for image:', error);
                interaction.editReply("画像の検索中にエラーが発生しました。");
            });
        } else {
            interaction.editReply("無効なサブコマンドです。");
        }
    } catch (error){
        interaction.editReply("画像の検索中にエラーが発生しました。");
    }
    }
};

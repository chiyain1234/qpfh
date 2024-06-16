const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const cmdName = "bissoku"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandBuilder()
        .setName(cmdName)
        .setDescription("ディ〇速")
        .addSubcommand(subcommand =>
            subcommand
            .setName("up")
            .setDescription("Dissoku Up(偽)をします")
        ),

    async execute(i, client) {

        if (i.options.getSubcommand() === 'up') {
            await i.deferReply();
            const image = client.user.displayAvatarURL()
            const Embed = new MessageEmbed()
                .setColor("#7289da")
                .setTitle(`**ディスコード速報 | Discordサーバー・友達募集・ボット掲示板**`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                .setURL(`https://dissoku.net/ja`)
                .setThumbnail("attachment://disso.png")
                .setDescription(`<@${i.user.id}>\ncommand: ` + `\`/dissoku up\`` + `\n` + `**\`${i.guild.name}\`**` + ` **をアップしたよ!**` + `\n` + `_**ActiveLevel ... ${generateRandomNumber()}**_\n \nサポートサーバー(https://discord.gg/たんたん)`)

            let attachment = new MessageAttachment(image, "disso.png");

            return i.editReply({ embeds: [Embed], files: [attachment] })
        }

    }
}

function generateRandomNumber() {
  let randomNumber = Math.floor(Math.random() * 100) + 1;
  let probability = Math.exp(-randomNumber / 50);
  let randomProbability = Math.random();
  if (randomProbability > probability) {
    return generateRandomNumber();
  } else {
    return randomNumber;
  }
}
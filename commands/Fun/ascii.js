const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
var figlet = require('figlet');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName("ascii")
        .setDescription("英数字をアスキーアートにする")
        .addStringOption(option => option.setName('text')
            .setDescription('英数字を入力してください。')
            .setRequired(true)),

    async execute(i) {

        var de = i.options.getString('text');
        figlet(de, function(err, data) {
            if (err) {
                i.reply('エラーが発生しました。');
                console.dir(err);
                return;
            }
            i.reply(`\`\`\`${data}\`\`\``)
        });
    }
}
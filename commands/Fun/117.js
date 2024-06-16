const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    guildOnly: false, 
    adminGuildOnly: false, 
    data: new SlashCommandSubcommandBuilder()
        .setName("117")
        .setDescription("現在の時刻を取得する。"),

    async execute(i) {        
      await i.reply(new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })); 
    }
}
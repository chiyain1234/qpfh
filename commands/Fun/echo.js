const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const cmdName = "echo";

module.exports = {
    guildOnly: true,
    adminGuildOnly: false,
    cooldown: 5,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("ボットにメッセージを送らせる。")
          .addStringOption(option => option.setName('text')
            .setDescription('文章を入力してください。')
            .setRequired(true)),

    async execute(i) {
        const text = i.options.getString('text');
        await i.reply({ content: 'Processing your command...', ephemeral: true });
        await i.deleteReply();

            await i.channel.send(text);
        }
};
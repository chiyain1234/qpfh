const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, Modal, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName("create_embed")
        .setDescription("埋め込みメッセージを作成する"),
    userPerm: "ADMINISTRATOR",
    async execute(i, client) {
      
    const modal = new Modal()
			.setCustomId('embed')
			.setTitle('埋め込みメッセージ')

            const author = new TextInputComponent()
  			.setCustomId('author')
			  .setLabel("著者欄を入力してください。")
        .setPlaceholder("著者欄を入力")        
        .setRequired(true)
			  .setStyle('SHORT');   
      
            const title = new TextInputComponent()
  			.setCustomId('title')
			  .setLabel("タイトルを入力してください。")
        .setPlaceholder("タイトルを入力")        
        .setRequired(true)
			  .setStyle('SHORT');
      
            const description = new TextInputComponent()
  			.setCustomId('description')
			  .setLabel("説明を入力してください。")
        .setPlaceholder("説明を入力")
      	.setRequired(true)
			  .setStyle('PARAGRAPH');   

            const footer = new TextInputComponent()
  			.setCustomId('footer')
			  .setLabel("フッターを入力してください。")
        .setPlaceholder("フッターを入力")        
        .setRequired(true)
			  .setStyle('SHORT');   
      
            const color = new TextInputComponent()
  			.setCustomId('color')
			  .setLabel("カラーコードを入力してください。")
        .setPlaceholder("カラーコードを入力(任意)")
			  .setStyle('SHORT');   

      		const one = new MessageActionRow().addComponents(title);
		const two = new MessageActionRow().addComponents(description);
		const three = new MessageActionRow().addComponents(color);
const four = new MessageActionRow().addComponents(footer);
const five = new MessageActionRow().addComponents(author);
      
		modal.addComponents(five, one, two, four, three);
      
		await i.showModal(modal);
      
    }
}
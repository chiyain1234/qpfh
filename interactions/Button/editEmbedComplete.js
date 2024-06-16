const client = require('../../index.js')

client.on("interactionCreate", async (i) => {

    if (i.customId === "editEmbedComplete") {
        let msgs = await i.channel.messages.fetch(i.message.id)
        await i.deferUpdate()
        return msgs.edit({ components: [] });

    }
})
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = {
    guildOnly: false, 
    adminGuildOnly: false, 
    data: new SlashCommandSubcommandBuilder()
        .setName("ai")
        .setDescription("AIと会話する。会話データは保存されません。")
        .addStringOption(option => option.setName('text')
            .setDescription('文章を入力してください。')
            .setRequired(true)),

    async execute(i) {      
        const text = i.options.getString('text');

        await i.deferReply();
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "あなたはすべて日本語で答えます。" },
                    { role: "user", content: text },
                ],
                model: "llama-3.3-70b-versatile",
            });

            const response = chatCompletion.choices[0]?.message?.content || "応答がありませんでした。再試行してください。";
            await i.editReply(response); 
        } catch (error) {
            console.error("AI応答中にエラーが発生しました:", error);
            await i.editReply("申し訳ありませんが、AI応答中にエラーが発生しました。しばらくしてから再試行してください。");
        }
    }
};

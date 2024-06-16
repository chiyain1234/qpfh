const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const vm = require('vm');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('run')
        .setDescription('コードを実行する。')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('実行するコードの言語を選択してください。')
                .setRequired(true)
                .addChoices(
                    { name: 'JavaScript', value: 'javascript' },
                    { name: 'Python', value: 'python' }
                )
        )
        .addStringOption(option =>
            option.setName('code')
                .setDescription('実行するコードを入力してください。')
                .setRequired(true)
        ),

    async execute(i) {
        const code = i.options.getString('code');
        const language = i.options.getString('language');
        await i.deferReply();

        try {
            if (language === 'javascript') {
                const sandbox = { console: { log: (...args) => sandbox.logs.push(...args) }, logs: [] };
                vm.createContext(sandbox);
                new vm.Script(`const result = eval(\`${code}\`); if (result !== undefined) console.log(result);`).runInContext(sandbox);
                const result = sandbox.logs.join('\n') || 'コードの実行が完了しました。';
                await i.editReply(`実行結果:\`\`\`js\n${result}\n\`\`\``);
            } else if (language === 'python') {
                if (code.includes('import os') || code.includes('import sys')) {
                    await i.editReply('禁止されたライブラリが含まれています。');
                    return;
                }
                exec(`python3 -c "${code.replace(/"/g, '\\"').replace(/\\n/g, '\n')}"`, (error, stdout, stderr) => {
                    if (error) {
                        i.editReply(`エラーが発生しました: \`\`\`py\n${stderr}\n\`\`\``);
                        return;
                    }
                    i.editReply(`実行結果:\n\`\`\`py\n${stdout}\n\`\`\``);
                });
            }
        } catch (error) {
            await i.editReply(`エラー: \`\`\`js\n${error.message}\n\`\`\``);
        }
    }
};

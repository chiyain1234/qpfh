const config = require("../config.js");

module.exports = {
    name: 'ready',
    async run(client) {
        await client.application.fetch();
        await client.application.commands.fetch();
        let totalCommands = 0;
        client.application.commands.cache.forEach(command => {
            totalCommands++;
            if (command.options) {
                totalCommands += countSubCommands(command.options);
            }
        });

        const time = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

        console.log("\x1b[36m%s\x1b[0m", client.user.tag + 'is online.')
        console.log("\x1b[36m%s\x1b[0m", totalCommands + ' commands are available.')
        console.log("\x1b[34m%s\x1b[0m", time);

        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const totalServer = client.guilds.cache.size
        setInterval(() => {
            const activities = [
                `/_help | ${totalMembers} members / ${totalServer} servers`,
                `/_help | ${totalCommands} commands are available`,
                `/_help | Bugs & Supports -> Supoort server`,
                `/_help | TanTan ~ω~`,
                `/_help | コマンドリストを表示`,
                `Tips | 隠しコマンドがあるらしい`,
                `Tips | Started on 2022/7/19`,
            ];

            const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
            const newActivity = activities[randomIndex];

            client.user.setPresence({
                activities: [{ name: newActivity, type: "CUSTOM" }],
                status: 'idle'
            });
        }, 30000);

        client.channels.cache.get(config.logch.ready).send(client.user.tag + 'でログインしました。');
    }
}

function countSubCommands(options) {
    let count = 0;
    options.forEach(option => {
        if (option.type === 'SUB_COMMAND' || option.type === 'SUB_COMMAND_GROUP') {
            count++;
            if (option.options) {
                count += countSubCommands(option.options);
            }
        }
    });
    return count;
}
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs").promises;
const config = require("./config.js");

const deployCommands = async () => {
  const rest = new REST({ version: "9" }).setToken(config.token);
  const clientId = config.clientId;
  const testGuild = config.dev.testGuild;

  const commands = [];
  const subcommands = new Set();
  const adminGuildCommands = [];

  const commandFolders = await fs.readdir("./commands");
  let totalFiles = 0;

  for (const folder of commandFolders) {
    const commandFiles = (await fs.readdir(`./commands/${folder}`)).filter(file => file.endsWith(".js"));
    totalFiles += commandFiles.length;

    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      const commandData = command.data.toJSON();

      if (command.adminGuildOnly) {
        adminGuildCommands.push(commandData);
      } else if (commandData.type === 1) {
        subcommands.add(commandData.name);
      } else if (!subcommands.has(commandData.name)) {
        commands.push(commandData);
      }
    }
  }

  console.log("\x1b[35m%s\x1b[0m", "Deploying commands...");

  try {
    await Promise.all([
      rest.put(Routes.applicationCommands(clientId), { body: commands }),
      rest.put(Routes.applicationGuildCommands(clientId, testGuild), { body: adminGuildCommands })
    ]);

    console.log("\x1b[32m%s\x1b[0m", "Successfully deployed commands!");
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error deploying commands:", error);
  }
};

module.exports = deployCommands;

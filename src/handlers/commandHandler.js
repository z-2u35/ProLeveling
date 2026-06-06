const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 * Load all slash commands from the commands directory
 * @param {Client} client - Discord.js client
 * @returns {Collection} Collection of loaded commands
 */
async function loadCommands(client) {
  const commands = [];
  const commandsPath = path.join(__dirname, '../commands');

  try {
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
      } else {
        console.warn(`⚠️ Command ${file} is missing 'data' or 'execute' property`);
      }
    }

    return commands;
  } catch (error) {
    console.error('Error loading commands:', error);
    return [];
  }
}

/**
 * Register slash commands with Discord
 * @param {Client} client - Discord.js client
 * @param {Array} commands - Array of command data
 */
async function registerSlashCommands(client, commands) {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    console.log(`📤 Registering ${commands.length} slash commands...`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    console.log(`✅ Successfully registered ${data.length} slash commands!`);
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}

module.exports = {
  loadCommands,
  registerSlashCommands,
};

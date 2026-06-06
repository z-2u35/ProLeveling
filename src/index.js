require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');

// Handlers
const { loadCommands, registerSlashCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Simple health check endpoint for UptimeRobot
app.get('/', (req, res) => {
  res.status(200).send('ProLeveling Bot is running! 🚀');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// Initialize Discord.js client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Initialize collections
client.commands = new Collection();

/**
 * Main startup function
 */
async function main() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Load events
    console.log('📚 Loading events...');
    await loadEvents(client);

    // Load commands
    console.log('📚 Loading commands...');
    const commands = await loadCommands(client);

    // Register slash commands with Discord
    await registerSlashCommands(client, commands);

    // Handle slash command interactions
    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = client.commands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({ content: '❌ Command not found!', ephemeral: true });
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('Command execution error:', error);
        await interaction.reply({
          content: '❌ An error occurred while executing this command!',
          ephemeral: true,
        });
      }
    });

    // Login to Discord
    console.log('🔐 Logging in to Discord...');
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('Fatal error during startup:', error);
    process.exit(1);
  }
}

// Handle process errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the bot
main();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await client.destroy();
  await mongoose.disconnect();
  process.exit(0);
});

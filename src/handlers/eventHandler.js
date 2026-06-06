const fs = require('fs');
const path = require('path');

/**
 * Load all event handlers from the events directory
 * @param {Client} client - Discord.js client
 */
async function loadEvents(client) {
  const eventsPath = path.join(__dirname, '../events');

  try {
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);

      if (event.name) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`✅ Loaded event: ${event.name}`);
      } else {
        console.warn(`⚠️ Event ${file} is missing 'name' property`);
      }
    }
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

module.exports = {
  loadEvents,
};

/**
 * ready event - Fired when the client becomes ready
 */
module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`🔗 Invite link: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`);

    // Set bot status
    client.user.setActivity('ProLeveling System', { type: 'WATCHING' });
  },
};

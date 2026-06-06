const Server = require('../models/Server');

/**
 * guildMemberRemove event
 * Handle: Leave Message + Invite Tracking
 */
module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    try {
      const server = await Server.findOne({ guildId: member.guild.id });

      if (!server) return;

      // Leave Message
      if (server.leaveMessage.enabled && server.leaveMessage.channelId) {
        try {
          const channel = member.guild.channels.cache.get(server.leaveMessage.channelId);
          if (channel) {
            const leaveMsg = server.leaveMessage.message
              .replace('{user}', member.user.username)
              .replace('{guild}', member.guild.name);

            await channel.send({
              content: leaveMsg,
            });
            console.log(`👋 Sent leave message for ${member.user.username}`);
          }
        } catch (error) {
          console.error('Error sending leave message:', error);
        }
      }
    } catch (error) {
      console.error('Error in guildMemberRemove event:', error);
    }
  },
};

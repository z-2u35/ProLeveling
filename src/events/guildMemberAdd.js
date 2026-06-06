const Server = require('../models/Server');

/**
 * guildMemberAdd event
 * Handle: Autorole + Welcome Message + Invite Tracking
 */
module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    try {
      const server = await Server.findOne({ guildId: member.guild.id });

      if (!server) return;

      // Autorole
      if (server.autorole.enabled && server.autorole.roleId) {
        try {
          const role = member.guild.roles.cache.get(server.autorole.roleId);
          if (role) {
            await member.roles.add(role);
            console.log(`✅ Assigned autorole ${role.name} to ${member.user.username}`);
          }
        } catch (error) {
          console.error('Error assigning autorole:', error);
        }
      }

      // Welcome Message
      if (server.welcomeMessage.enabled && server.welcomeMessage.channelId) {
        try {
          const channel = member.guild.channels.cache.get(server.welcomeMessage.channelId);
          if (channel) {
            const welcomeMsg = server.welcomeMessage.message
              .replace('{user}', member.toString())
              .replace('{guild}', member.guild.name);

            await channel.send({
              content: welcomeMsg,
            });
            console.log(`📩 Sent welcome message to ${member.user.username}`);
          }
        } catch (error) {
          console.error('Error sending welcome message:', error);
        }
      }

      // Invite Tracking
      if (server.inviteTracking.enabled) {
        try {
          const invites = await member.guild.invites.fetch();
          const invitedBy = invites.find((invite) => (invite.uses || 0) > (invite.usedBefore || 0))?.inviter;

          if (invitedBy) {
            const Invite = require('../models/Invite');
            const inviteRecord = new Invite({
              guildId: member.guild.id,
              inviterId: invitedBy.id,
              inviterUsername: invitedBy.username,
              invitedId: member.id,
              invitedUsername: member.user.username,
              joinedAt: new Date(),
            });
            await inviteRecord.save();
            console.log(`👥 Tracked invite: ${invitedBy.username} → ${member.user.username}`);
          }
        } catch (error) {
          console.error('Error tracking invite:', error);
        }
      }
    } catch (error) {
      console.error('Error in guildMemberAdd event:', error);
    }
  },
};

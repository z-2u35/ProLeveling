const Server = require('../models/Server');

/**
 * messageReactionAdd event
 * Handle: Reaction Roles
 */
module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    try {
      // Ignore bot reactions
      if (user.bot) return;

      // Fetch full reaction if needed
      if (reaction.partial) {
        await reaction.fetch();
      }

      const server = await Server.findOne({ guildId: reaction.message.guildId });
      if (!server) return;

      // Find matching reaction role
      const reactionRole = server.reactionRoles.find(
        (rr) =>
          rr.messageId === reaction.message.id &&
          rr.emoji === reaction.emoji.toString()
      );

      if (!reactionRole) return;

      const role = reaction.message.guild.roles.cache.get(reactionRole.roleId);
      const member = await reaction.message.guild.members.fetch(user.id);

      if (role && member) {
        await member.roles.add(role);
        console.log(`✅ Gave role ${role.name} to ${user.username} via reaction`);
      }
    } catch (error) {
      console.error('Error in messageReactionAdd event:', error);
    }
  },
};

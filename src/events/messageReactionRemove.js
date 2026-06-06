const Server = require('../models/Server');
const Moderation = require('../models/Moderation');

/**
 * messageReactionRemove event
 * Handle: Reaction Roles (remove)
 */
module.exports = {
  name: 'messageReactionRemove',
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
        await member.roles.remove(role);
        console.log(`❌ Removed role ${role.name} from ${user.username}`);
      }
    } catch (error) {
      console.error('Error in messageReactionRemove event:', error);
    }
  },
};

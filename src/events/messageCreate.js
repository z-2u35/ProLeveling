const User = require('../models/User');
const config = require('../../config.json');
const { calculateLevel, getXpProgress } = require('../utils/calculateXp');

/**
 * messageCreate event - Handles text leveling
 * Grants XP for messages with 60-second cooldown per user
 */
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Ignore DMs
    if (!message.guild) return;

    // Check if channel is blacklisted
    if (config.blacklistedChannels.includes(message.channelId)) return;

    // Check if user has blacklisted role
    const hasBlacklistedRole = config.blacklistedRoles.some((roleId) =>
      message.member.roles.cache.has(roleId)
    );
    if (hasBlacklistedRole) return;

    try {
      let user = await User.findOne({
        userId: message.author.id,
        guildId: message.guildId,
      });

      // Create user if doesn't exist
      if (!user) {
        user = new User({
          userId: message.author.id,
          guildId: message.guildId,
          username: message.author.username,
          avatar: message.author.displayAvatarURL({ format: 'png', size: 512 }),
        });
      }

      // Update user data
      user.username = message.author.username;
      user.avatar = message.author.displayAvatarURL({ format: 'png', size: 512 });

      // Check cooldown
      const now = Date.now();
      const cooldown = config.xpSettings.textMessageCooldown;

      if (user.lastMessageTime && now - user.lastMessageTime < cooldown) {
        return; // Still on cooldown
      }

      // Award XP
      const xpGain = Math.floor(
        Math.random() *
          (config.xpSettings.textMessageMax - config.xpSettings.textMessageMin + 1) +
          config.xpSettings.textMessageMin
      );

      const oldLevel = user.level;
      user.xp += xpGain;
      user.totalXp += xpGain;
      user.level = calculateLevel(user.totalXp);
      user.lastMessageTime = new Date();

      await user.save();

      // Check for level up
      if (user.level > oldLevel) {
        await handleLevelUp(message, user, oldLevel);
      }
    } catch (error) {
      console.error('Error in messageCreate event:', error);
    }
  },
};

/**
 * Handle level up event
 * @param {Message} message - Discord message object
 * @param {Document} user - User document from database
 * @param {number} oldLevel - Previous level
 */
async function handleLevelUp(message, user, oldLevel) {
  try {
    const progressData = getXpProgress(user.totalXp);

    // Send level up message
    const levelUpEmbed = {
      color: 0x00d4ff,
      title: `🎉 Level Up!`,
      description: `Congratulations ${message.author}! You have reached **Level ${user.level}**!`,
      thumbnail: {
        url: message.author.displayAvatarURL({ format: 'png', size: 512 }),
      },
      fields: [
        {
          name: '📊 Progress',
          value: `Level ${oldLevel} → Level ${user.level}`,
          inline: true,
        },
        {
          name: '⭐ Total XP',
          value: `${user.totalXp} XP`,
          inline: true,
        },
      ],
      timestamp: new Date(),
    };

    // Send in dedicated channel or current channel
    if (config.levelUpSettings.dedicatedChannel) {
      const channel = message.guild.channels.cache.get(config.levelUpSettings.dedicatedChannel);
      if (channel) {
        await channel.send({ embeds: [levelUpEmbed] });
      }
    } else if (config.levelUpSettings.sendInChannel) {
      await message.reply({ embeds: [levelUpEmbed] });
    }

    // Check and assign role rewards
    const roleRewardId = config.roleRewards[user.level.toString()];
    if (roleRewardId) {
      try {
        const role = message.guild.roles.cache.get(roleRewardId);
        if (role && message.member) {
          await message.member.roles.add(role);
          const roleRewardEmbed = {
            color: 0x00d4ff,
            description: `🏆 You have been awarded the **${role.name}** role!`,
          };
          await message.reply({ embeds: [roleRewardEmbed] });
        }
      } catch (error) {
        console.error('Error assigning role reward:', error);
      }
    }
  } catch (error) {
    console.error('Error handling level up:', error);
  }
}

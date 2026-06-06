const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const Server = require('../models/Server');
const config = require('../../config.json');
const { calculateLevel, getXpProgress } = require('../utils/calculateXp');

/**
 * messageCreate event - Handles text leveling, trigger words, and auto-moderation
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
      // Handle server-specific features
      const server = await Server.findOne({ guildId: message.guildId });

      // Trigger Words
      if (server && server.triggerWords.length > 0) {
        const messageContent = message.content.toLowerCase();
        for (const trigger of server.triggerWords) {
          if (messageContent.includes(trigger.keyword)) {
            await message.reply({
              content: trigger.response,
              allowedMentions: { repliedUser: false },
            });
            break; // Only respond once per message
          }
        }
      }

      // Auto-moderation
      if (server && server.autoModeration.enabled) {
        // Bad word filter
        if (server.autoModeration.badWords.length > 0) {
          const messageContent = message.content.toLowerCase();
          for (const badWord of server.autoModeration.badWords) {
            if (messageContent.includes(badWord.toLowerCase())) {
              try {
                await message.delete();
                await message.reply({
                  content: '❌ That message contains inappropriate language.',
                  allowedMentions: { repliedUser: false },
                });
                return;
              } catch (error) {
                console.error('Error deleting message:', error);
              }
            }
          }
        }

        // Link filter
        if (server.autoModeration.linkFilter) {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          if (urlRegex.test(message.content)) {
            try {
              await message.delete();
              await message.reply({
                content: '❌ Links are not allowed in this server.',
                allowedMentions: { repliedUser: false },
              });
              return;
            } catch (error) {
              console.error('Error deleting message:', error);
            }
          }
        }

        // Invite filter
        if (server.autoModeration.inviteFilter) {
          const inviteRegex = /(discord\.gg|discord\.com\/invite)/g;
          if (inviteRegex.test(message.content)) {
            try {
              await message.delete();
              await message.reply({
                content: '❌ Server invites are not allowed.',
                allowedMentions: { repliedUser: false },
              });
              return;
            } catch (error) {
              console.error('Error deleting message:', error);
            }
          }
        }
      }

      // XP Leveling System
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
    const levelUpEmbed = new EmbedBuilder()
      .setColor('#FFD700')
      .setAuthor({ name: '🎉 Level Up!', iconURL: message.author.displayAvatarURL() })
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', size: 512 }))
      .setDescription(`> Congratulations ${message.author}!\n> You just advanced to **Level ${user.level}** 🌟`)
      .addFields({
        name: ' ',
        value: `📊 **Progress:** \`Level ${oldLevel}\` ➔ **\`Level ${user.level}\`**\n💫 **Total XP:** \`${user.totalXp.toLocaleString()} XP\``,
        inline: false,
      })
      .setTimestamp();

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
          const roleRewardEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setDescription(`🏆 **Role Unlocked!**\n> You have been awarded the ${role.toString()} role!`);
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

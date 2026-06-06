const User = require('../models/User');
const config = require('../../config.json');
const { calculateLevel } = require('../utils/calculateXp');

/**
 * voiceStateUpdate event - Handles voice leveling
 * Grants XP for every minute spent in a voice channel
 * Does NOT grant XP if:
 * - User is self-muted
 * - User is self-deafened
 * - User is alone in the channel
 */
module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const { member, guild, channelId } = newState;

    // Ignore bot users
    if (member.user.bot) return;

    // Check if channel is blacklisted
    if (channelId && config.blacklistedChannels.includes(channelId)) return;

    // Check if user has blacklisted role
    if (member) {
      const hasBlacklistedRole = config.blacklistedRoles.some((roleId) =>
        member.roles.cache.has(roleId)
      );
      if (hasBlacklistedRole) return;
    }

    try {
      let user = await User.findOne({
        userId: member.id,
        guildId: guild.id,
      });

      // Create user if doesn't exist
      if (!user) {
        user = new User({
          userId: member.id,
          guildId: guild.id,
          username: member.user.username,
          avatar: member.user.displayAvatarURL({ format: 'png', size: 512 }),
        });
      }

      // Update user data
      user.username = member.user.username;
      user.avatar = member.user.displayAvatarURL({ format: 'png', size: 512 });

      // User joined a voice channel
      if (!oldState.channelId && newState.channelId) {
        // Check if user is self-muted or self-deafened
        if (newState.selfMute || newState.selfDeaf) {
          return; // Don't grant XP
        }

        // Check if user is alone in channel
        const channel = newState.channel;
        if (channel.members.size <= 1) {
          return; // Don't grant XP if alone
        }

        user.lastVoiceJoin = new Date();
        await user.save();
      }

      // User left a voice channel
      if (oldState.channelId && !newState.channelId) {
        if (user.lastVoiceJoin) {
          // Check if user was self-muted or self-deafened (use old state)
          if (oldState.selfMute || oldState.selfDeaf) {
            // Don't grant XP, but still clear the join time
            user.lastVoiceJoin = null;
            await user.save();
            return;
          }

          // Check if user was alone
          const oldChannel = oldState.channel;
          if (oldChannel && oldChannel.members.size <= 1) {
            user.lastVoiceJoin = null;
            await user.save();
            return;
          }

          // Calculate minutes spent in voice
          const timeSpent = (Date.now() - user.lastVoiceJoin.getTime()) / 1000 / 60;
          const minutesSpent = Math.floor(timeSpent);

          if (minutesSpent >= 1) {
            const oldLevel = user.level;
            const xpGain = minutesSpent * config.xpSettings.voiceXpPerMinute;

            user.xp += xpGain;
            user.totalXp += xpGain;
            user.voiceMinutes += minutesSpent;
            user.level = calculateLevel(user.totalXp);
            user.lastVoiceJoin = null;

            await user.save();

            // Check for level up (optional notification in voice channels)
            if (user.level > oldLevel) {
              const Server = require('../models/Server');
              const server = await Server.findOne({ guildId: guild.id });
              let targetChannel = null;
              
              if (server && server.levelUpMessage && server.levelUpMessage.enabled && server.levelUpMessage.channelId) {
                targetChannel = guild.channels.cache.get(server.levelUpMessage.channelId);
              } else if (config.levelUpSettings.dedicatedChannel) {
                targetChannel = guild.channels.cache.get(config.levelUpSettings.dedicatedChannel);
              }
              
              if (!targetChannel) targetChannel = guild.channels.cache.filter((ch) => ch.isTextBased()).first();

              if (targetChannel) {
                const member_obj = await guild.members.fetch(user.userId);
                const levelUpEmbed = {
                  color: 0xFFD700,
                  description: `🎉 ${member_obj} reached **Level ${user.level}**! (Voice XP)`,
                  timestamp: new Date(),
                };
                await targetChannel.send({ embeds: [levelUpEmbed] });
              }
            }
          } else {
            user.lastVoiceJoin = null;
            await user.save();
          }
        }
      }
    } catch (error) {
      console.error('Error in voiceStateUpdate event:', error);
    }
  },
};

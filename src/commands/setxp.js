const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../models/User');
const { calculateLevel, getXpProgress } = require('../utils/calculateXp');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setxp')
    .setDescription('Set exactly how much total XP a user has (Admin only)')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to set XP for')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The exact amount of XP to set')
        .setMinValue(0)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      // Check if user has admin permission
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#2b2d31')
              .setDescription('⛔ **Only admins can use this command!**'),
          ],
        });
      }

      const targetUser = interaction.options.getUser('user');
      const xpAmount = interaction.options.getInteger('amount');

      // Prevent setting XP for bots
      if (targetUser.bot) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#2b2d31')
              .setDescription('🤖 **Cannot set XP for bots!**'),
          ],
        });
      }

      // Fetch or create user
      let user = await User.findOne({
        userId: targetUser.id,
        guildId: interaction.guildId,
      });

      if (!user) {
        user = new User({
          userId: targetUser.id,
          guildId: interaction.guildId,
          username: targetUser.username,
          avatar: targetUser.displayAvatarURL({ format: 'png', size: 512 }),
        });
      }

      // Store old values for comparison
      const oldLevel = user.level;
      const oldTotalXp = user.totalXp;

      // Set XP and calculate new level
      user.xp = xpAmount;
      user.totalXp = xpAmount;
      user.level = calculateLevel(user.totalXp);
      user.username = targetUser.username;
      user.avatar = targetUser.displayAvatarURL({ format: 'png', size: 512 });

      await user.save();

      // Get progress data
      const progressData = getXpProgress(user.totalXp);

      // Build response embed
      const setEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setAuthor({ name: '✨ XP Set Successfully', iconURL: interaction.user.displayAvatarURL() })
        .setThumbnail(targetUser.displayAvatarURL({ format: 'png', size: 512 }))
        .addFields(
          {
            name: ' ',
            value: `> 👤 **User:** ${targetUser.toString()}\n> 🎯 **Target XP:** \`${xpAmount.toLocaleString()} XP\`\n> 📊 **Total:** \`${oldTotalXp.toLocaleString()}\` ➔ **\`${user.totalXp.toLocaleString()}\` XP**`,
            inline: false,
          }
        );

      // Check if level changed
      if (user.level !== oldLevel) {
        setEmbed.addFields(
          {
            name: user.level > oldLevel ? '🎉 Level Up!' : '📉 Level Adjusted',
            value: `> Level \`${oldLevel}\` ➔ **Level \`${user.level}\`**`,
            inline: false,
          }
        );

        // Check for role rewards if level increased
        if (user.level > oldLevel) {
          const roleRewardId = config.roleRewards[user.level.toString()];
          if (roleRewardId) {
            try {
              const role = interaction.guild.roles.cache.get(roleRewardId);
              if (role) {
                const member = await interaction.guild.members.fetch(targetUser.id);
                await member.roles.add(role);
                setEmbed.addFields({
                  name: '🏆 Role Reward',
                  value: `> Awarded: ${role.toString()}`,
                  inline: true,
                });
              }
            } catch (error) {
              console.error('Error assigning role reward:', error);
            }
          }
        }
      } else {
        setEmbed.addFields(
          {
            name: '🎯 Progress to Next Level',
            value: `> \`${progressData.currentXp.toLocaleString()}\` / \`${(progressData.xpForNextLevel - progressData.xpForCurrentLevel).toLocaleString()} XP\``,
            inline: false,
          }
        );
      }

      setEmbed.setFooter({
        text: `Command executed by ${interaction.user.username}`,
      });

      await interaction.editReply({
        embeds: [setEmbed],
      });
    } catch (error) {
      console.error('Error in /setxp command:', error);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('#2b2d31')
            .setDescription('⚠️ **An error occurred while setting XP!**'),
        ],
      });
    }
  },
};
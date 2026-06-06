const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const { getXpProgress } = require('../utils/calculateXp');
const { generateRankCard } = require('../utils/canvasRenderer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Display your or another user\'s rank card')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to check rank for (optional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;

      // Fetch user from database
      let user = await User.findOne({
        userId: targetUser.id,
        guildId: interaction.guildId,
      });

      if (!user) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ff0000')
              .setDescription(`❌ User **${targetUser.username}** has not earned any XP yet!`),
          ],
        });
      }

      // Get XP progress data
      const progressData = getXpProgress(user.totalXp);

      // Get user rank in guild
      const usersAbove = await User.countDocuments({
        guildId: interaction.guildId,
        totalXp: { $gt: user.totalXp },
      });
      const rank = usersAbove + 1;

      // Prepare data for canvas
      const rankCardData = {
        username: targetUser.username,
        avatar: targetUser.displayAvatarURL({ format: 'png', size: 512 }),
        level: progressData.level,
        rank,
        currentXp: progressData.currentXp,
        xpForCurrentLevel: progressData.xpForCurrentLevel,
        xpForNextLevel: progressData.xpForNextLevel,
        totalXp: user.totalXp,
        progressPercentage: progressData.progressPercentage,
      };

      // Generate rank card
      const rankCardBuffer = await generateRankCard(rankCardData);

      // Send rank card
      await interaction.editReply({
        files: [{ attachment: rankCardBuffer, name: 'rank-card.png' }],
      });
    } catch (error) {
      console.error('Error in /rank command:', error);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('❌ An error occurred while generating the rank card!'),
        ],
      });
    }
  },
};

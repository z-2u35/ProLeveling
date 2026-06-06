const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
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
              .setColor('#2b2d31')
              .setDescription(`✨ **${targetUser.username}** hasn't started their journey yet!\n> Chat to earn XP.`),
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
        avatar: targetUser.displayAvatarURL({ extension: 'png', size: 512 }),
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
      const attachment = new AttachmentBuilder(rankCardBuffer, { name: 'rank-card.png' });

      const rankEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setAuthor({
          name: `${targetUser.username}'s Rank Card`,
          iconURL: targetUser.displayAvatarURL({ dynamic: true }),
        })
        .setImage('attachment://rank-card.png');

      // Send rank card
      await interaction.editReply({
        embeds: [rankEmbed],
        files: [attachment],
      });
    } catch (error) {
      console.error('Error in /rank command:', error);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('#2b2d31')
            .setDescription('⚠️ **An error occurred while generating the rank card!**'),
        ],
      });
    }
  },
};

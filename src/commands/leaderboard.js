const { SlashCommandBuilder, EmbedBuilder, APIEmbedField } = require('discord.js');
const User = require('../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the top 10 users by XP'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      // Fetch top 10 users by total XP
      const topUsers = await User.find({ guildId: interaction.guildId })
        .sort({ totalXp: -1 })
        .limit(10);

      if (topUsers.length === 0) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ffaa00')
              .setDescription('📊 No users have earned XP yet!'),
          ],
        });
      }

      // Build leaderboard embed
      const leaderboardEmbed = new EmbedBuilder()
        .setColor('#00d4ff')
        .setTitle('🏆 Server Leaderboard')
        .setDescription('Top 10 users by total XP')
        .setFooter({
          text: `Guild: ${interaction.guild.name}`,
          iconURL: interaction.guild.iconURL(),
        })
        .setTimestamp();

      // Add fields for each user
      const fields = [];
      topUsers.forEach((user, index) => {
        const medal = ['🥇', '🥈', '🥉'];
        const icon = medal[index] || `${index + 1}.`;

        fields.push({
          name: `${icon} ${user.username}`,
          value: `Level: **${user.level}** | XP: **${user.totalXp}**`,
          inline: false,
        });
      });

      leaderboardEmbed.addFields(fields);

      await interaction.editReply({
        embeds: [leaderboardEmbed],
      });
    } catch (error) {
      console.error('Error in /leaderboard command:', error);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('❌ An error occurred while fetching the leaderboard!'),
        ],
      });
    }
  },
};

const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
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
              .setColor('#2b2d31')
              .setDescription('✨ **No users have earned XP yet!**\n> Start chatting to be the first!'),
          ],
        });
      }

      // Build leaderboard embed with better formatting
      const leaderboardEmbed = new EmbedBuilder()
        .setColor('#FFD700') // Premium Gold Look
        .setTitle('🏆 **Global Leaderboard**')
        .setDescription(`*Top most active members in **${interaction.guild.name}***\n`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      // Create formatted leaderboard string
      let leaderboardText = '';

      topUsers.forEach((user, index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const medal = medals[index] || `\` #${index + 1} \``;
        const username = user.username.length > 15 ? user.username.substring(0, 15) + '...' : user.username;
        const xp = user.totalXp.toLocaleString();

        leaderboardText += `${medal} **${username}**\n`;
        leaderboardText += `> 💠 **Level ${user.level}** • 💫 \`${xp} XP\`\n\n`;
      });

      leaderboardEmbed.addFields(
        {
          name: ' ',
          value: leaderboardText,
          inline: false,
        }
      );

      // Add stats bar
      const totalXp = topUsers.reduce((sum, user) => sum + user.totalXp, 0);

      leaderboardEmbed.addFields({
        name: ' ',
        value: `📊 **Server Stats**\n> Total XP (Top 10): \`${totalXp.toLocaleString()} XP\`\n> *Use \`/rank\` to check your own stats!*`,
        inline: false,
      });

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

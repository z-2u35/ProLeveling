const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Display detailed profile information for you or another user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to check the profile for (optional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      
      // Try to fetch the member to get server-specific data like join date
      const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

      // Fetch user from database
      let userDb = await User.findOne({
        userId: targetUser.id,
        guildId: interaction.guildId,
      });

      // Calculate Rank
      let rank = 'N/A';
      if (userDb && userDb.totalXp > 0) {
        const usersAbove = await User.countDocuments({
          guildId: interaction.guildId,
          totalXp: { $gt: userDb.totalXp },
        });
        rank = `#${usersAbove + 1}`;
      } else {
        // Create dummy data if user hasn't earned any XP yet
        userDb = { level: 0, totalXp: 0, voiceMinutes: 0 };
      }

      // Format Voice Time (convert minutes to Hours and Minutes)
      const voiceMinutes = userDb.voiceMinutes || 0;
      const hours = Math.floor(voiceMinutes / 60);
      const minutes = voiceMinutes % 60;
      const voiceTimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      // Format Join Date
      const joinDate = targetMember 
        ? `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:R>` 
        : '*Not in server*';
      
      const roleCount = targetMember 
        ? targetMember.roles.cache.size - 1 // -1 to exclude @everyone role
        : 0;

      const profileEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setAuthor({
          name: `${targetUser.username}'s Profile`,
          iconURL: targetUser.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
        .addFields(
          {
            name: '📊 Leveling Stats',
            value: `> 💠 **Level:** \`${userDb.level}\`\n> 🏆 **Rank:** \`${rank}\`\n> 💫 **Total XP:** \`${userDb.totalXp.toLocaleString()} XP\``,
            inline: false,
          },
          {
            name: '🎙️ Voice Activity',
            value: `> 🎧 **Total Voice Time:** \`${voiceTimeStr}\``,
            inline: false,
          },
          {
            name: '📅 Server Info',
            value: `> 📆 **Joined:** ${joinDate}\n> 🏷️ **Roles:** \`${roleCount}\``,
            inline: false,
          }
        )
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [profileEmbed] });
    } catch (error) {
      console.error('Error in /profile command:', error);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('#2b2d31')
            .setDescription('⚠️ **An error occurred while fetching the profile!**'),
        ],
      });
    }
  },
};
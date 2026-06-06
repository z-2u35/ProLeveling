const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Moderation = require('../models/Moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to warn')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for warning')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const targetUser = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      // Prevent warning bots
      if (targetUser.bot) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ff0000')
              .setDescription('❌ Cannot warn bots!'),
          ],
        });
      }

      // Get case number
      const lastWarning = await Moderation.findOne({ guildId: interaction.guildId })
        .sort({ caseNumber: -1 });
      const caseNumber = (lastWarning?.caseNumber || 0) + 1;

      // Create warning record
      const warning = new Moderation({
        userId: targetUser.id,
        guildId: interaction.guildId,
        username: targetUser.username,
        action: 'warn',
        reason,
        moderator: interaction.user.id,
        caseNumber,
      });

      await warning.save();

      // Get user's warn count
      const warnCount = await Moderation.countDocuments({
        userId: targetUser.id,
        guildId: interaction.guildId,
        action: 'warn',
      });

      const warnEmbed = new EmbedBuilder()
        .setColor('#ffaa00')
        .setTitle('⚠️ User Warned')
        .addFields(
          {
            name: '👤 User',
            value: targetUser.toString(),
            inline: true,
          },
          {
            name: '📋 Case',
            value: `#${caseNumber}`,
            inline: true,
          },
          {
            name: '📝 Reason',
            value: reason,
            inline: false,
          },
          {
            name: '⚠️ Total Warns',
            value: `${warnCount}`,
            inline: true,
          }
        )
        .setFooter({
          text: `Warned by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [warnEmbed] });

      // Try to DM user
      try {
        await targetUser.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#ffaa00')
              .setDescription(
                `⚠️ You have been warned in **${interaction.guild.name}**\n\n**Reason:** ${reason}\n**Warns:** ${warnCount}`
              ),
          ],
        });
      } catch (err) {
        console.log('Could not DM user');
      }
    } catch (error) {
      console.error('Error in warn command:', error);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('❌ An error occurred!'),
        ],
      });
    }
  },
};

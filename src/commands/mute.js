const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Moderation = require('../models/Moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to mute')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('duration')
        .setDescription('Duration (e.g., 1h, 30m, 1d)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for mute')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const targetUser = interaction.options.getUser('user');
      const durationString = interaction.options.getString('duration');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      // Parse duration
      const durationMs = parseDuration(durationString);
      if (!durationMs) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ff0000')
              .setDescription('❌ Invalid duration format! Use: 1h, 30m, 1d, etc.'),
          ],
        });
      }

      // Apply mute timeout
      await targetMember.timeout(durationMs, reason);

      // Log in database
      const caseNumber = (await Moderation.findOne({ guildId: interaction.guildId }).sort({ caseNumber: -1 }))?.caseNumber || 0;

      const muteRecord = new Moderation({
        userId: targetUser.id,
        guildId: interaction.guildId,
        username: targetUser.username,
        action: 'mute',
        reason,
        moderator: interaction.user.id,
        duration: durationMs,
        expiresAt: new Date(Date.now() + durationMs),
        caseNumber: caseNumber + 1,
      });

      await muteRecord.save();

      const muteEmbed = new EmbedBuilder()
        .setColor('#ff6600')
        .setTitle('🔇 User Muted')
        .addFields(
          {
            name: '👤 User',
            value: targetUser.toString(),
            inline: true,
          },
          {
            name: '⏱️ Duration',
            value: durationString,
            inline: true,
          },
          {
            name: '📝 Reason',
            value: reason,
            inline: false,
          }
        )
        .setFooter({
          text: `Muted by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [muteEmbed] });
    } catch (error) {
      console.error('Error in mute command:', error);
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

function parseDuration(durationString) {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const regex = /(\d+)([smhd])/i;
  const match = durationString.match(regex);

  if (!match) return null;

  const amount = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  return amount * (units[unit] || 0);
}

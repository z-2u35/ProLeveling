const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to kick')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for kick')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const targetUser = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      // Prevent kicking bots
      if (targetUser.bot) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ff0000')
              .setDescription('❌ Cannot kick bots!'),
          ],
        });
      }

      // Check hierarchy
      if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ff0000')
              .setDescription('❌ Cannot kick someone with equal or higher role!'),
          ],
        });
      }

      // Kick the user
      await targetMember.kick(reason);

      const kickEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('👢 User Kicked')
        .addFields(
          {
            name: '👤 User',
            value: targetUser.toString(),
            inline: true,
          },
          {
            name: '📝 Reason',
            value: reason,
            inline: false,
          }
        )
        .setFooter({
          text: `Kicked by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [kickEmbed] });

      // Try to DM user
      try {
        await targetUser.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#ff0000')
              .setDescription(
                `👢 You have been kicked from **${interaction.guild.name}**\n\n**Reason:** ${reason}`
              ),
          ],
        });
      } catch (err) {
        console.log('Could not DM user');
      }
    } catch (error) {
      console.error('Error in kick command:', error);
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

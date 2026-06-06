const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to ban')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for ban')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const targetUser = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      // Prevent banning bots
      if (targetUser.bot) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ff0000')
              .setDescription('❌ Cannot ban bots!'),
          ],
        });
      }

      // Ban the user
      await interaction.guild.members.ban(targetUser, { reason });

      const banEmbed = new EmbedBuilder()
        .setColor('#8b0000')
        .setTitle('🔨 User Banned')
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
          text: `Banned by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [banEmbed] });

      // Try to DM user
      try {
        await targetUser.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#8b0000')
              .setDescription(
                `🔨 You have been banned from **${interaction.guild.name}**\n\n**Reason:** ${reason}`
              ),
          ],
        });
      } catch (err) {
        console.log('Could not DM user');
      }
    } catch (error) {
      console.error('Error in ban command:', error);
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

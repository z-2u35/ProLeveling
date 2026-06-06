const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to unmute')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const targetUser = interaction.options.getUser('user');
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      // Remove timeout
      await targetMember.timeout(null);

      const unmuteEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🔊 User Unmuted')
        .addFields(
          {
            name: '👤 User',
            value: targetUser.toString(),
            inline: true,
          }
        )
        .setFooter({
          text: `Unmuted by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [unmuteEmbed] });
    } catch (error) {
      console.error('Error in unmute command:', error);
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

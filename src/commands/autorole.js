const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Server = require('../models/Server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Setup autorole - Automatically assign role when users join')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set autorole')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role to assign on join')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove autorole')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const subcommand = interaction.options.getSubcommand();
      let server = await Server.findOne({ guildId: interaction.guildId });

      if (!server) {
        server = new Server({
          guildId: interaction.guildId,
          guildName: interaction.guild.name,
        });
      }

      if (subcommand === 'set') {
        const role = interaction.options.getRole('role');

        server.autorole.enabled = true;
        server.autorole.roleId = role.id;
        await server.save();

        const setupEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Autorole Configured')
          .setDescription(`Members will now receive ${role} when they join!`)
          .addFields({
            name: 'Role',
            value: role.toString(),
            inline: true,
          });

        await interaction.editReply({ embeds: [setupEmbed] });
      } else if (subcommand === 'remove') {
        server.autorole.enabled = false;
        server.autorole.roleId = null;
        await server.save();

        const removeEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('❌ Autorole Disabled')
          .setDescription('Autorole has been removed.');

        await interaction.editReply({ embeds: [removeEmbed] });
      }
    } catch (error) {
      console.error('Error in autorole command:', error);
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

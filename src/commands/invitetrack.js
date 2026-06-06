const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Server = require('../models/Server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invitetrack')
    .setDescription('Setup invite tracking - See who invited whom')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('enable')
        .setDescription('Enable invite tracking')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('disable')
        .setDescription('Disable invite tracking')
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

      if (subcommand === 'enable') {
        server.inviteTracking.enabled = true;
        await server.save();

        const enableEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Invite Tracking Enabled')
          .setDescription('The bot will now track which user invited which members!');

        await interaction.editReply({ embeds: [enableEmbed] });
      } else if (subcommand === 'disable') {
        server.inviteTracking.enabled = false;
        await server.save();

        const disableEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('❌ Invite Tracking Disabled')
          .setDescription('Invite tracking has been turned off.');

        await interaction.editReply({ embeds: [disableEmbed] });
      }
    } catch (error) {
      console.error('Error in invitetrack command:', error);
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

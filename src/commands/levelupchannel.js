const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Server = require('../models/Server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('levelupchannel')
    .setDescription('Setup a dedicated channel for level up announcements')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set the specific channel for level up messages')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel to send level up messages to')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove the dedicated channel (defaults back to current chat)')
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

      if (!server.levelUpMessage) server.levelUpMessage = {};

      if (subcommand === 'set') {
        const channel = interaction.options.getChannel('channel');

        server.levelUpMessage.enabled = true;
        server.levelUpMessage.channelId = channel.id;
        await server.save();

        const setupEmbed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle('✅ Level Up Channel Set')
          .setDescription(`> All level up notifications will now be sent to ${channel}`);

        await interaction.editReply({ embeds: [setupEmbed] });
      } else if (subcommand === 'remove') {
        server.levelUpMessage.enabled = false;
        server.levelUpMessage.channelId = null;
        await server.save();

        const removeEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('❌ Level Up Channel Removed')
          .setDescription('> Level up notifications will default back to the chat channel.');

        await interaction.editReply({ embeds: [removeEmbed] });
      }
    } catch (error) {
      console.error('Error in levelupchannel command:', error);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('#2b2d31')
            .setDescription('⚠️ **An error occurred while configuring the channel!**'),
        ],
      });
    }
  },
};
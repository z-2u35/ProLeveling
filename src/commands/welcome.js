const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Server = require('../models/Server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Setup welcome message for new members')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set welcome message')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Channel to send welcome message')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('message')
            .setDescription('Welcome message (use {user} for mention, {guild} for server name)')
            .setRequired(true)
            .setMaxLength(500)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove welcome message')
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
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        server.welcomeMessage.enabled = true;
        server.welcomeMessage.channelId = channel.id;
        server.welcomeMessage.message = message;
        await server.save();

        const setupEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Welcome Message Configured')
          .setDescription(`Welcome messages will be sent to ${channel}`)
          .addFields(
            {
              name: 'Channel',
              value: channel.toString(),
              inline: true,
            },
            {
              name: 'Message Preview',
              value: message
                .replace('{user}', 'User#0000')
                .replace('{guild}', interaction.guild.name)
                .substring(0, 200),
              inline: false,
            }
          );

        await interaction.editReply({ embeds: [setupEmbed] });
      } else if (subcommand === 'remove') {
        server.welcomeMessage.enabled = false;
        server.welcomeMessage.channelId = null;
        await server.save();

        const removeEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('❌ Welcome Message Disabled')
          .setDescription('Welcome messages have been removed.');

        await interaction.editReply({ embeds: [removeEmbed] });
      }
    } catch (error) {
      console.error('Error in welcome command:', error);
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

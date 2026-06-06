const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Server = require('../models/Server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Setup auto-moderation settings')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('enable')
        .setDescription('Enable auto-moderation')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('disable')
        .setDescription('Disable auto-moderation')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('linkfilter')
        .setDescription('Enable/disable link filter')
        .addBooleanOption((option) =>
          option
            .setName('enabled')
            .setDescription('Enable link filter')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('invitefilter')
        .setDescription('Enable/disable invite filter')
        .addBooleanOption((option) =>
          option
            .setName('enabled')
            .setDescription('Enable invite filter')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('addbadword')
        .setDescription('Add a word to bad word filter')
        .addStringOption((option) =>
          option
            .setName('word')
            .setDescription('Word to filter')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('removebadword')
        .setDescription('Remove a word from bad word filter')
        .addStringOption((option) =>
          option
            .setName('word')
            .setDescription('Word to remove')
            .setRequired(true)
        )
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
        server.autoModeration.enabled = true;
        await server.save();

        const enableEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Auto-moderation Enabled')
          .setDescription('Auto-moderation features are now active!');

        await interaction.editReply({ embeds: [enableEmbed] });
      } else if (subcommand === 'disable') {
        server.autoModeration.enabled = false;
        await server.save();

        const disableEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('❌ Auto-moderation Disabled')
          .setDescription('Auto-moderation has been turned off.');

        await interaction.editReply({ embeds: [disableEmbed] });
      } else if (subcommand === 'linkfilter') {
        const enabled = interaction.options.getBoolean('enabled');
        server.autoModeration.linkFilter = enabled;
        await server.save();

        const statusEmbed = new EmbedBuilder()
          .setColor(enabled ? '#00ff00' : '#ff0000')
          .setTitle(`${enabled ? '✅' : '❌'} Link Filter ${enabled ? 'Enabled' : 'Disabled'}`)
          .setDescription(enabled ? 'Links will now be automatically deleted' : 'Link filtering is off');

        await interaction.editReply({ embeds: [statusEmbed] });
      } else if (subcommand === 'invitefilter') {
        const enabled = interaction.options.getBoolean('enabled');
        server.autoModeration.inviteFilter = enabled;
        await server.save();

        const statusEmbed = new EmbedBuilder()
          .setColor(enabled ? '#00ff00' : '#ff0000')
          .setTitle(`${enabled ? '✅' : '❌'} Invite Filter ${enabled ? 'Enabled' : 'Disabled'}`)
          .setDescription(enabled ? 'Server invites will now be automatically deleted' : 'Invite filtering is off');

        await interaction.editReply({ embeds: [statusEmbed] });
      } else if (subcommand === 'addbadword') {
        const word = interaction.options.getString('word').toLowerCase();

        if (server.autoModeration.badWords.includes(word)) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`❌ Word "${word}" is already in the filter!`),
            ],
          });
        }

        server.autoModeration.badWords.push(word);
        await server.save();

        const addEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Bad Word Added')
          .setDescription(`Added "${word}" to the bad word filter`);

        await interaction.editReply({ embeds: [addEmbed] });
      } else if (subcommand === 'removebadword') {
        const word = interaction.options.getString('word').toLowerCase();

        const index = server.autoModeration.badWords.indexOf(word);
        if (index === -1) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`❌ Word "${word}" not found in filter!`),
            ],
          });
        }

        server.autoModeration.badWords.splice(index, 1);
        await server.save();

        const removeEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Bad Word Removed')
          .setDescription(`Removed "${word}" from the bad word filter`);

        await interaction.editReply({ embeds: [removeEmbed] });
      }
    } catch (error) {
      console.error('Error in automod command:', error);
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

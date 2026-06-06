const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Server = require('../models/Server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trigger')
    .setDescription('Manage trigger words - Bot responds when keyword is mentioned')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a trigger word')
        .addStringOption((option) =>
          option
            .setName('keyword')
            .setDescription('Keyword to trigger on')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('response')
            .setDescription('Bot response message')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove a trigger word')
        .addStringOption((option) =>
          option
            .setName('keyword')
            .setDescription('Keyword to remove')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('List all trigger words')
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

      if (subcommand === 'add') {
        const keyword = interaction.options.getString('keyword').toLowerCase();
        const response = interaction.options.getString('response');

        // Check if already exists
        const exists = server.triggerWords.find((tw) => tw.keyword === keyword);
        if (exists) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`❌ Trigger word "${keyword}" already exists!`),
            ],
          });
        }

        server.triggerWords.push({ keyword, response, exact: false });
        await server.save();

        const addEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Trigger Word Added')
          .addFields(
            {
              name: 'Keyword',
              value: `\`${keyword}\``,
              inline: true,
            },
            {
              name: 'Response',
              value: response.substring(0, 100),
              inline: false,
            }
          );

        await interaction.editReply({ embeds: [addEmbed] });
      } else if (subcommand === 'remove') {
        const keyword = interaction.options.getString('keyword').toLowerCase();

        const index = server.triggerWords.findIndex((tw) => tw.keyword === keyword);
        if (index === -1) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`❌ Trigger word "${keyword}" not found!`),
            ],
          });
        }

        server.triggerWords.splice(index, 1);
        await server.save();

        const removeEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Trigger Word Removed')
          .setDescription(`Removed trigger word: \`${keyword}\``);

        await interaction.editReply({ embeds: [removeEmbed] });
      } else if (subcommand === 'list') {
        if (server.triggerWords.length === 0) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('#ffaa00')
                .setDescription('No trigger words configured yet.'),
            ],
          });
        }

        const listEmbed = new EmbedBuilder()
          .setColor('#00d4ff')
          .setTitle('📋 Trigger Words')
          .setDescription(
            server.triggerWords
              .map((tw, i) => `**${i + 1}.** \`${tw.keyword}\` → ${tw.response.substring(0, 50)}...`)
              .join('\n')
          );

        await interaction.editReply({ embeds: [listEmbed] });
      }
    } catch (error) {
      console.error('Error in trigger command:', error);
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

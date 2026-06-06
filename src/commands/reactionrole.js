const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Server = require('../models/Server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('Setup reaction roles - Users get role by reacting with emoji')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add reaction role')
        .addStringOption((option) =>
          option
            .setName('messageid')
            .setDescription('Message ID to add reaction role to')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('emoji')
            .setDescription('Emoji to react with')
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role to assign')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove reaction role')
        .addStringOption((option) =>
          option
            .setName('messageid')
            .setDescription('Message ID')
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

      if (subcommand === 'add') {
        const messageId = interaction.options.getString('messageid');
        const emoji = interaction.options.getString('emoji');
        const role = interaction.options.getRole('role');

        const setupEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Reaction Role Added')
          .addFields(
            {
              name: 'Emoji',
              value: emoji,
              inline: true,
            },
            {
              name: 'Role',
              value: role.toString(),
              inline: true,
            },
            {
              name: 'Message ID',
              value: messageId,
              inline: false,
            },
            {
              name: 'How to use',
              value: 'Users will get the role when they react with the emoji on that message!',
              inline: false,
            }
          );

        server.reactionRoles.push({
          messageId,
          channelId: interaction.channelId,
          emoji,
          roleId: role.id,
        });
        await server.save();

        await interaction.editReply({ embeds: [setupEmbed] });
      } else if (subcommand === 'remove') {
        const messageId = interaction.options.getString('messageid');

        const index = server.reactionRoles.findIndex((rr) => rr.messageId === messageId);
        if (index === -1) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`❌ Reaction role for message ${messageId} not found!`),
            ],
          });
        }

        server.reactionRoles.splice(index, 1);
        await server.save();

        const removeEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Reaction Role Removed')
          .setDescription(`Removed reaction role for message: \`${messageId}\``);

        await interaction.editReply({ embeds: [removeEmbed] });
      }
    } catch (error) {
      console.error('Error in reactionrole command:', error);
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

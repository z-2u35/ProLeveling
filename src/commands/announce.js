const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to a channel')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Channel to announce in')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('Announcement title')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('Announcement message')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const channel = interaction.options.getChannel('channel');
      const title = interaction.options.getString('title');
      const message = interaction.options.getString('message');

      const announcementEmbed = new EmbedBuilder()
        .setColor('#00d4ff')
        .setTitle(`📢 ${title}`)
        .setDescription(message)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      await channel.send({ embeds: [announcementEmbed] });

      const confirmEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Announcement Sent')
        .addFields(
          {
            name: 'Channel',
            value: channel.toString(),
            inline: true,
          },
          {
            name: 'Title',
            value: title,
            inline: true,
          }
        );

      await interaction.editReply({ embeds: [confirmEmbed] });
    } catch (error) {
      console.error('Error in announce command:', error);
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

const mongoose = require('mongoose');

const moderationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    guildId: {
      type: String,
      required: true,
    },
    username: String,
    action: {
      type: String,
      enum: ['warn', 'mute', 'unmute', 'kick', 'ban'],
      required: true,
    },
    reason: {
      type: String,
      default: 'No reason provided',
    },
    moderator: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: null, // in milliseconds
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    caseNumber: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

moderationSchema.index({ guildId: 1, userId: 1 });
moderationSchema.index({ guildId: 1, action: 1 });

module.exports = mongoose.model('Moderation', moderationSchema);

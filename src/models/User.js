const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    guildId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: 'Unknown User',
    },
    avatar: {
      type: String,
      default: null,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    totalXp: {
      type: Number,
      default: 0,
    },
    voiceMinutes: {
      type: Number,
      default: 0,
    },
    lastMessageTime: {
      type: Date,
      default: null,
    },
    lastVoiceJoin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ guildId: 1, totalXp: -1 });
userSchema.index({ userId: 1, guildId: 1 });

module.exports = mongoose.model('User', userSchema);

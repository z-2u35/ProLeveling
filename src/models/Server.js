const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
    },
    guildName: {
      type: String,
      default: 'Unknown Guild',
    },
    // Level Up Message Settings
    levelUpMessage: {
      enabled: {
        type: Boolean,
        default: false,
      },
      channelId: {
        type: String,
        default: null,
      },
    },
    // Autorole Settings
    autorole: {
      enabled: {
        type: Boolean,
        default: false,
      },
      roleId: {
        type: String,
        default: null,
      },
    },
    // Welcome Message Settings
    welcomeMessage: {
      enabled: {
        type: Boolean,
        default: false,
      },
      channelId: {
        type: String,
        default: null,
      },
      message: {
        type: String,
        default: 'Welcome {user} to {guild}!',
      },
    },
    // Leave Message Settings
    leaveMessage: {
      enabled: {
        type: Boolean,
        default: false,
      },
      channelId: {
        type: String,
        default: null,
      },
      message: {
        type: String,
        default: '{user} has left {guild}',
      },
    },
    // Auto-moderation Settings
    autoModeration: {
      enabled: {
        type: Boolean,
        default: false,
      },
      spamFilter: {
        enabled: {
          type: Boolean,
          default: false,
        },
        messagesInSeconds: {
          type: Number,
          default: 5, // 5 messages in X seconds = spam
        },
        timeWindow: {
          type: Number,
          default: 5000, // 5 seconds
        },
        action: {
          type: String,
          enum: ['warn', 'mute', 'kick'],
          default: 'warn',
        },
      },
      badWords: [String], // List of banned words
      inviteFilter: {
        type: Boolean,
        default: false,
      },
      linkFilter: {
        type: Boolean,
        default: false,
      },
    },
    // Trigger Words Settings
    triggerWords: [
      {
        keyword: String,
        response: String,
        exact: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Reaction Roles
    reactionRoles: [
      {
        messageId: String,
        channelId: String,
        emoji: String,
        roleId: String,
      },
    ],
    // Announcements
    announcements: [
      {
        title: String,
        message: String,
        channelId: String,
        sentAt: Date,
      },
    ],
    // Invite Tracking
    inviteTracking: {
      enabled: {
        type: Boolean,
        default: false,
      },
      logChannelId: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

serverSchema.index({ guildId: 1 });

module.exports = mongoose.model('Server', serverSchema);

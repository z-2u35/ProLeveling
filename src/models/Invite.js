const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    inviterId: {
      type: String,
      required: true,
    },
    inviterUsername: String,
    invitedId: {
      type: String,
      required: true,
    },
    invitedUsername: String,
    inviteCode: String,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

inviteSchema.index({ guildId: 1, inviterId: 1 });
inviteSchema.index({ guildId: 1, invitedId: 1 });

module.exports = mongoose.model('Invite', inviteSchema);

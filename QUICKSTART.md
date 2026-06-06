# ProLeveling - Quick Start Guide 🚀

## ⚡ 5-Minute Setup

### Step 1: Copy `.env` and Configure
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proleveling?retryWrites=true&w=majority
```

### Step 2: Configure Role Rewards (Optional)
Edit `config.json` to add role rewards:
```json
"roleRewards": {
  "5": "YOUR_ROLE_ID_HERE",
  "10": "YOUR_ROLE_ID_HERE"
}
```

### Step 3: Run the Bot
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

You should see:
```
✅ Connected to MongoDB
✅ Loaded command: rank
✅ Loaded command: leaderboard
✅ Bot is ready! Logged in as ProLeveling#1234
```

---

## 📋 How It Works

### Text Leveling
- Users gain 15-25 random XP per message
- 60-second cooldown between messages
- Automatically calculates levels and sends level-up messages

### Voice Leveling
- Users gain 5 XP per minute in voice channels
- No XP if self-muted, self-deafened, or alone
- Tracked automatically when joining/leaving

### Slash Commands

**`/rank`** - Show your rank card
```
/rank
/rank @username
```

**`/leaderboard`** - Show top 10 users
```
/leaderboard
```

---

## 🔧 Configuration Reference

### Blacklist Channels/Roles
Don't award XP in specific places:
```json
"blacklistedChannels": ["CHANNEL_ID"],
"blacklistedRoles": ["ROLE_ID"]
```

### Level Up Message Settings
```json
"levelUpSettings": {
  "sendInChannel": true,           // Send in user's channel
  "dedicatedChannel": "CHANNEL_ID" // OR send in specific channel
}
```

### Adjust XP Rates
```json
"xpSettings": {
  "textMessageMin": 15,         // Min text XP
  "textMessageMax": 25,         // Max text XP
  "textMessageCooldown": 60000, // Cooldown in milliseconds
  "voiceXpPerMinute": 5         // Voice XP per minute
}
```

---

## 📊 Level Progression

| Level | Total XP Needed |
|-------|-----------------|
| 1     | 100             |
| 5     | 1,500           |
| 10    | 5,500           |
| 15    | 12,500          |
| 20    | 22,000          |
| 25    | 34,500          |
| 30    | 50,000          |

---

## 🐛 Troubleshooting

### "Bot is offline"
- Check `DISCORD_TOKEN` in `.env`
- Verify bot is added to your Discord server
- Check bot permissions (should have Admin)

### "MongoDB connection failed"
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas cluster is active
- Ensure IP whitelist includes your connection

### "Commands not showing up"
- Ensure bot is online (check Discord)
- Wait 1 minute for Discord to sync
- Try `/rank` command in any channel
- If still not working, check console for errors

### "No XP is being awarded"
- Check if channel is in `blacklistedChannels`
- Check if user role is in `blacklistedRoles`
- Verify 60-second cooldown for text messages
- Check MongoDB is connected (console should show "✅ Connected to MongoDB")

---

## 🔐 Getting Your IDs

### Discord Token
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. Go to "Bot" section
4. Click "Add Bot"
5. Copy token under USERNAME

### Client ID
1. Same Developer Portal
2. Go to "General Information"
3. Copy "APPLICATION ID"

### Role/Channel IDs
1. Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
2. Right-click on role/channel → Copy User/Channel ID

### MongoDB URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Click "Connect" → "Drivers"
5. Copy connection string and replace username/password

---

## 📱 Hosting on Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create "New Web Service"
4. Connect your GitHub repo
5. Set Build Command: `npm install`
6. Set Start Command: `npm start`
7. Add environment variables (copy from `.env`)

---

## 💡 Next Steps

- Customize rank card colors in `src/utils/canvasRenderer.js`
- Add more commands in `src/commands/`
- Adjust XP formula in `src/utils/calculateXp.js`
- Monitor bot with UptimeRobot: `https://your-app.onrender.com/health`

---

**Need help?** Check README.md for full documentation!

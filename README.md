# ProLeveling - Advanced Discord Leveling Bot

A production-ready Discord.js v14 leveling bot with MEE6 Premium-equivalent features, including text/voice leveling, role rewards, and beautiful rank cards.

## Features ✨

### Core Leveling System
- **Text Leveling**: 15-25 random XP per message with 60-second cooldown
- **Voice Leveling**: 5 XP per minute in voice channels (no XP if self-muted, self-deafened, or alone)
- **Rank Cards**: Beautiful customized image-based rank cards using Canvas
- **Leaderboard**: Top 10 users by total XP

### Advanced Features
- **Role Rewards**: Automatically assign roles when users reach specific levels
- **Blacklist System**: Ignore XP gain in blacklisted channels and for blacklisted roles
- **Level Up Notifications**: Customizable messages in channel or dedicated #level-up channel
- **Quadratic XP Progression**: Realistic XP requirements that increase with level
- **MongoDB Integration**: Persistent data storage with Mongoose

### Web Server
- Express.js web server on port 3000 for Render hosting
- Health check endpoints for UptimeRobot monitoring

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Discord bot token (from [Discord Developer Portal](https://discord.com/developers/applications))
- MongoDB Atlas database (free tier available at [mongodb.com](https://mongodb.com))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/z-2u35/ProLeveling.git
   cd ProLeveling
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env`**
   ```env
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proleveling?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=production
   ```

5. **Configure `config.json`**
   
   Edit role rewards, blacklist channels/roles, and XP settings:
   ```json
   {
     "roleRewards": {
       "5": "ROLE_ID_FOR_LEVEL_5",
       "10": "ROLE_ID_FOR_LEVEL_10"
     },
     "blacklistedChannels": ["CHANNEL_ID_1"],
     "blacklistedRoles": ["ROLE_ID_1"],
     "levelUpSettings": {
       "sendInChannel": true,
       "dedicatedChannel": null
     }
   }
   ```

## Running the Bot

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Commands

### `/rank [user]`
Display your or another user's rank card with:
- Avatar and username
- Current level and rank
- XP progress bar
- Total XP

**Example:**
```
/rank @username
```

### `/leaderboard`
Display the top 10 users by total XP with medals (🥇🥈🥉)

## Configuration Guide

### Role Rewards (`config.json`)
Map levels to Discord role IDs:
```json
"roleRewards": {
  "5": "1234567890",    // Role ID for level 5
  "10": "0987654321",   // Role ID for level 10
  "20": "5555555555"    // Role ID for level 20
}
```

### Blacklist System
```json
"blacklistedChannels": [
  "123456789"  // Ignore #bot-commands channel
],
"blacklistedRoles": [
  "987654321"  // Ignore @Muted role
]
```

### Level Up Messages
```json
"levelUpSettings": {
  "sendInChannel": true,           // Send in channel where user leveled up
  "dedicatedChannel": "123456789"  // OR send in specific #level-up channel
}
```

### XP Settings
```json
"xpSettings": {
  "textMessageMin": 15,         // Min XP per message
  "textMessageMax": 25,         // Max XP per message
  "textMessageCooldown": 60000, // 60 second cooldown (in ms)
  "voiceXpPerMinute": 5         // 5 XP per minute in voice
}
```

## XP & Level Formula

The bot uses a **quadratic progression** formula:

```
XP for Level N = 50 * N² + 50 * N
```

Examples:
- Level 1: 100 XP
- Level 5: 1,500 XP
- Level 10: 5,500 XP
- Level 20: 22,000 XP

## Database Schema

### User Model
```javascript
{
  userId: String,              // Discord user ID
  guildId: String,             // Discord guild ID
  username: String,            // Discord username
  avatar: String,              // Avatar URL
  xp: Number,                  // Current level XP (0-max for level)
  level: Number,               // Current level
  totalXp: Number,             // Total XP earned
  voiceMinutes: Number,        // Total minutes in voice
  lastMessageTime: Date,       // Cooldown tracker
  lastVoiceJoin: Date,         // Voice session tracker
  timestamps: Date             // Auto-tracked by Mongoose
}
```

## Hosting on Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Set Start Command: `npm start`
   - Add environment variables from `.env`

3. **Enable UptimeRobot**
   - Monitor the health endpoint: `https://your-app.onrender.com/health`

## Project Structure

```
ProLeveling/
├── src/
│   ├── index.js                 # Entry point
│   ├── models/
│   │   └── User.js             # Mongoose User schema
│   ├── handlers/
│   │   ├── commandHandler.js    # Load & register commands
│   │   └── eventHandler.js      # Load event listeners
│   ├── events/
│   │   ├── ready.js            # Bot ready event
│   │   ├── messageCreate.js     # Text leveling
│   │   └── voiceStateUpdate.js  # Voice leveling
│   ├── commands/
│   │   ├── rank.js             # /rank command
│   │   └── leaderboard.js       # /leaderboard command
│   └── utils/
│       ├── calculateXp.js       # XP & level calculations
│       └── canvasRenderer.js    # Rank card generation
├── config.json                  # Configuration (roles, blacklist, etc)
├── .env.example                 # Environment template
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Troubleshooting

### Bot doesn't respond to commands
- Ensure slash commands are registered: check console for "✅ Loaded command"
- Verify bot has `applications.commands` scope in OAuth2 settings
- Check bot has proper permissions in the server

### No XP is being awarded
- Verify MongoDB is connected (check console)
- Check if channel is in `blacklistedChannels`
- Check if user role is in `blacklistedRoles`
- Ensure 60-second cooldown has passed for text XP

### Voice XP not working
- User must not be self-muted or self-deafened
- User must not be alone in the channel
- Voice channel must not be blacklisted

### Canvas errors when generating rank cards
- Ensure canvas dependencies are properly installed
- On Linux, you may need: `apt-get install build-essential libcairo2-dev`

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| discord.js | ^14.26.4 | Discord API wrapper |
| mongoose | ^9.6.3 | MongoDB ODM |
| dotenv | ^17.4.2 | Environment variables |
| express | ^5.2.1 | Web server |
| canvas | ^3.2.3 | Rank card generation |

## License

ISC

## Support

For issues or feature requests, please open an issue on [GitHub](https://github.com/z-2u35/ProLeveling/issues).

---

**Made with ❤️ for Discord communities**

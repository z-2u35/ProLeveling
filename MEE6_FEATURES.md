# 🚀 ProLeveling - MEE6 Premium Features

## ✨ Complete Feature List

### 🎖️ Moderation Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/warn <user> [reason]` | Warn a user | Admin only |
| `/kick <user> [reason]` | Kick a user from server | Admin only |
| `/ban <user> [reason]` | Ban a user permanently | Admin only |
| `/mute <user> <duration> [reason]` | Mute user (1h, 30m, 1d) | Admin only |
| `/unmute <user>` | Unmute a user | Admin only |

### ⚙️ Server Configuration
| Command | Description | Setup |
|---------|-------------|-------|
| `/autorole set <role>` | Auto-assign role on join | Admin only |
| `/welcome set <channel> <message>` | Welcome new members | Use {user} and {guild} tags |
| `/leave set <channel> <message>` | Goodbye message | Use {user} and {guild} tags |
| `/announce <channel> <title> <message>` | Send announcements | Admin only |

### 🔧 Advanced Features
| Command | Description | Usage |
|---------|-------------|-------|
| `/trigger add <keyword> <response>` | Auto-respond to keywords | Trigger on mention |
| `/trigger list` | View all trigger words | List all configured |
| `/reactionrole add <messageid> <emoji> <role>` | Role via emoji react | Setup message ID |
| `/automod enable` | Enable auto-moderation | Link/invite/badword filters |
| `/automod linkfilter true/false` | Toggle link detection | Delete URLs |
| `/automod invitefilter true/false` | Toggle invite detection | Delete server invites |
| `/automod addbadword <word>` | Add word to filter | Auto-delete messages |
| `/invitetrack enable` | Track invites | See who invited whom |

### 📊 Leveling Commands (Existing)
| Command | Description |
|---------|-------------|
| `/rank [user]` | View rank card with XP |
| `/leaderboard` | Top 10 users by XP |
| `/give <user> <amount>` | Admin give XP to user |

---

## 🎯 Example Setups

### Basic Server Setup
```
1. /autorole set @Member
   → Auto-assign Member role to new users

2. /welcome set #welcome "Welcome {user} to {guild}! 🎉"
   → Send welcome message to new members

3. /leave set #goodbye "{user} has left {guild}"
   → Send goodbye message when member leaves

4. /autorole set @member
```

### Anti-Spam Protection
```
1. /automod enable
   → Enable all moderation features

2. /automod linkfilter true
   → Delete links in chat

3. /automod invitefilter true
   → Delete server invites

4. /automod addbadword spam
5. /automod addbadword badword
   → Auto-delete messages with these words
```

### Trigger Words & Auto-Responses
```
/trigger add hello "Hello {user}! 👋"
/trigger add help "Need help? Check the pinned messages!"
/trigger add rules "Read our server rules in #rules"
/trigger list
   → View all configured triggers
```

### Reaction Roles Setup
1. Send a message in #roles channel
2. Copy message ID (Developer Mode)
3. `/reactionrole add <messageid> 🎮 @Gamer`
4. `/reactionrole add <messageid> 🎨 @Artist`
   → Users react with emoji to get role

### Invite Tracking
```
/invitetrack enable
   → Bot will log when user joins
   → Can see who invited them in database
```

---

## 📈 Automatic Features

### On Member Join
✅ Auto-assign autorole  
✅ Send welcome message  
✅ Track invite (who invited this member)  

### On Member Leave
✅ Send leave message  

### On Message Send
✅ Grant XP (text leveling)  
✅ Check trigger words  
✅ Auto-moderate (links, invites, bad words)  

### On Message React
✅ Assign role via emoji  

---

## 🗄️ Database Models

### Server Configuration
- Autorole settings
- Welcome/leave messages
- Trigger words
- Reaction roles
- Auto-moderation settings
- Invite tracking status

### Moderation History
- Warn records with case numbers
- Mute/unmute history with expiry
- Kick/ban logs

### Invite Tracking
- Inviter ID & username
- Invited user ID & username
- Join timestamp

---

## 🚀 Getting Started

### 1. Run the bot
```bash
npm start
```

### 2. Configure server settings (Admin only)
```
/autorole set @MemberRole
/welcome set #welcome "Welcome {user}!"
/automod enable
```

### 3. Setup moderation
```
/warn @User "Spamming"
/mute @User 1h "Breaking rules"
/ban @User "Toxic behavior"
```

### 4. Enable leveling & autoresponses
```
/give @User 500
/trigger add hello "Hi there! 👋"
/rank @User
/leaderboard
```

---

## 💡 Pro Tips

1. **Autorole**: Set to @everyone for all new members
2. **Message tags**: Use {user} and {guild} in welcome/leave messages
3. **Trigger words**: Add helpful responses like FAQ, rules, support links
4. **Reaction roles**: Great for gaming roles, interests, verification
5. **Auto-moderation**: Prevent spam before it happens
6. **Moderation cases**: Each warn/mute gets a case number for records

---

## 📋 Changelog

**Latest Update: MEE6 Premium Full Feature Pack**
- ✅ Moderation system (warn, kick, ban, mute)
- ✅ Autorole system
- ✅ Welcome/leave messages
- ✅ Trigger words with auto-responses
- ✅ Reaction roles
- ✅ Auto-moderation (links, invites, bad words)
- ✅ Invite tracking
- ✅ Announcements system

All features are fully functional and production-ready! 🎉

---

**ProLeveling** - The Ultimate Discord Bot for MEE6 Alternative! 🚀

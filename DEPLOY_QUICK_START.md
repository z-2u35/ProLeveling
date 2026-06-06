# ⚡ ProLeveling Deployment - 5 Minutes Setup

## 🎯 Your Bot Will Run 24/7 on Cloud with Automatic Health Checks

---

## 📋 Quick Timeline

```
Minute 1-2: Render Setup ⏱️
Minute 3-4: Add Environment Variables 🔐
Minute 5: Deploy ✅
→ Bot Running Online 🌍

Then:
Minute 5: Setup UptimeRobot 🤖
→ Bot Stays Alive Forever ✨
```

---

## 🚀 Step 1: Render Deployment (2 minutes)

### 1.1 Go to Render
👉 https://render.com

### 1.2 Sign Up or Login
- Click "Sign up" or "Log in"
- Connect with GitHub

### 1.3 Create Web Service
1. Click "New +" → "Web Service"
2. Select: `z-2u35/ProLeveling` repository
3. Fill in settings:
   ```
   Name: proleveling
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free ✅
   ```
4. Click "Create Web Service"

Wait for deployment... 🕐

---

## 🔐 Step 2: Add Environment Variables (2 minutes)

### 2.1 Get Your Environment Variables Ready

From your `.env` file, you need:
```
DISCORD_TOKEN = [your_token]
DISCORD_CLIENT_ID = [your_client_id]
MONGODB_URI = [your_mongodb_uri]
PORT = 3000
NODE_ENV = production
```

### 2.2 Add to Render

In Render dashboard for your service:
1. Click "Environment" tab
2. Click "Add Environment Variable"
3. Add these 5 variables:

| Key | Value |
|-----|-------|
| DISCORD_TOKEN | your_token_here |
| DISCORD_CLIENT_ID | your_client_id_here |
| MONGODB_URI | mongodb+srv://... |
| PORT | 3000 |
| NODE_ENV | production |

4. Click "Save Changes"

App will redeploy automatically ✅

---

## ✅ Step 3: Verify Deployment (1 minute)

### 3.1 Check Render Logs
1. Click "Logs" tab
2. Wait for these messages:
   ```
   ✅ Connected to MongoDB
   ✅ Loaded command: rank
   ✅ Loaded command: leaderboard
   ...
   ✅ Bot is ready!
   🌐 Web server running on port 3000
   ```

### 3.2 Test Health Endpoint
Open this in browser:
```
https://proleveling.onrender.com/health
```

Should show:
```json
{"status":"ok","timestamp":"2026-06-06T..."}
```

✅ **Bot is LIVE!**

---

## 🤖 Step 4: UptimeRobot Setup (1 minute)

**Why?** Render free tier shuts down after 15 min of inactivity. UptimeRobot pings your bot every 5 minutes to keep it alive.

### 4.1 Create UptimeRobot Account
👉 https://uptimerobot.com
- Sign up with email
- Verify email

### 4.2 Add Monitor
1. Login to UptimeRobot
2. Click "Add New Monitor"
3. Configure:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: ProLeveling Bot
   URL: https://proleveling.onrender.com/health
   Monitoring Interval: 5 minutes ⭐
   ```
4. Click "Create Monitor"

### 4.3 Verify
Status should show: **UP ✅**

---

## 🎉 Result

### Your Bot Now:
✅ Runs on cloud 24/7  
✅ Auto-restarts on crash  
✅ Auto-updates with git push  
✅ Monitored every 5 minutes  
✅ Stays alive forever  
✅ Costs $0 (free tier)  

### Architecture:
```
Discord
   ↓ (Commands/Events)
ProLeveling Bot (on Render)
   ↓ (Stores data)
MongoDB Atlas
   ↓ (Health check)
UptimeRobot (every 5 min)
```

---

## 📊 Monitor Your Bot

### Render Dashboard
https://render.com → Your service
- View logs in real-time
- Check CPU/Memory usage
- See deployment history

### UptimeRobot Dashboard
https://uptimerobot.com → Your monitor
- Uptime percentage
- Response times
- Ping history

---

## 🔄 Update Bot Code

Any time you update code and push to GitHub:
```bash
git add .
git commit -m "Update features"
git push origin main
```

Render will **automatically redeploy** within 1-2 minutes! 🚀

---

## 🐛 Troubleshooting

### Bot shows offline on Discord but Render says online?
```
→ Check Render logs for errors
→ Verify DISCORD_TOKEN is correct
→ Check MongoDB connection
```

### UptimeRobot shows DOWN?
```
→ Render app may be restarting (normal)
→ Check /health endpoint in browser
→ Verify Render service is running
```

### Too many errors in Render logs?
```
→ Check environment variables
→ Verify all required env vars are set
→ Check MongoDB credentials
```

---

## 📖 Full Documentation

- **MEE6_FEATURES.md** - All bot commands
- **RENDER_DEPLOY.md** - Detailed Render guide
- **UPTIMEROBOT_GUIDE.md** - Detailed UptimeRobot guide
- **QUICKSTART.md** - Local development setup
- **README.md** - Project overview

---

## ✨ Summary

| Step | Time | Status |
|------|------|--------|
| Render Setup | 2 min | ✅ |
| Environment Variables | 2 min | ✅ |
| Verify Deployment | 1 min | ✅ |
| UptimeRobot Setup | 1 min | ✅ |
| **Total** | **6 min** | **✅ DONE** |

Your bot is now running 24/7 on the cloud! 🌍✨

---

**GitHub:** https://github.com/z-2u35/ProLeveling  
**Render App:** https://proleveling.onrender.com  
**Health Check:** https://proleveling.onrender.com/health  

**Happy Bot Hosting!** 🎉

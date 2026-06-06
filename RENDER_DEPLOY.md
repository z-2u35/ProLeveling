# Deploy ProLeveling to Render.com with UptimeRobot Monitoring

## 🚀 Step 1: Push Code to GitHub

All code is already pushed to: https://github.com/z-2u35/ProLeveling

## 📦 Step 2: Deploy to Render.com

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Sign up" → Connect GitHub
3. Authorize Render to access your repositories

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Select repository: `ProLeveling`
3. Fill in details:
   - **Name**: `proleveling` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Add Environment Variables
On the Render dashboard, click "Environment" and add:

```
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proleveling
PORT=3000
NODE_ENV=production
```

### 2.4 Deploy
Click "Create Web Service" and wait for deployment to complete.

**Your Render URL will be:**
```
https://proleveling.onrender.com
```

Health check endpoint:
```
https://proleveling.onrender.com/health
```

---

## 🤖 Step 3: Setup UptimeRobot (Auto Ping Every 5 Minutes)

**Why UptimeRobot?**  
- Render spins down free tier apps after 15 minutes of inactivity
- UptimeRobot pings your app every 5 minutes
- Keeps the app running 24/7 ✅

### 3.1 Create UptimeRobot Account
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Click "Sign up"
3. Create account with email

### 3.2 Add Monitor
1. Log in to UptimeRobot
2. Click "Add New Monitor"
3. Fill in:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `ProLeveling Bot`
   - **URL**: `https://proleveling.onrender.com/health`
   - **Monitoring Interval**: `5 minutes` ⭐
   - **Alert Contacts**: (optional) Add your email

4. Click "Create Monitor"

### 3.3 Verify It Works
- UptimeRobot will start pinging your app every 5 minutes
- Check Render logs to see requests from UptimeRobot
- Bot will stay awake 24/7! 🎉

---

## ✅ Verify Everything Works

### Check Render Logs
1. Go to Render dashboard
2. Click your service
3. Open "Logs" tab
4. You should see:
   ```
   ✅ Connected to MongoDB
   ✅ Loaded command: rank
   ✅ Loaded command: leaderboard
   ...
   ✅ Bot is ready! Logged in as ProLeveling#1234
   🌐 Web server running on port 3000
   ```

### Check UptimeRobot
1. UptimeRobot dashboard
2. Your monitor should show "Up"
3. Click on monitor to see ping history

### Test Health Endpoint
Open in browser or terminal:
```bash
curl https://proleveling.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-06-06T..."
}
```

---

## 🔐 Security Notes

⚠️ **Never commit .env file!**
- Always use Render environment variables
- Never share DISCORD_TOKEN or MONGODB_URI

✅ **Render.yaml automatically configured**
- All env vars are marked with `sync: false`
- Only set them in Render dashboard

---

## 📊 Monitoring Dashboard

### Render Monitoring
- CPU usage
- Memory usage
- Deployment history
- Error logs

### UptimeRobot Monitoring
- Response times
- Uptime percentage
- Ping history
- Email alerts (optional)

---

## 🐛 Troubleshooting

### Bot offline on Render?
```
✅ Check Render logs
✅ Verify environment variables are set
✅ Check MongoDB connection string
✅ Ensure DISCORD_TOKEN is correct
```

### UptimeRobot shows "Down"?
```
✅ Render app may be restarting (normal)
✅ Check if Render has crashed (see logs)
✅ Verify health endpoint: /health
```

### Frequent crashes?
```
✅ Check memory usage (Render free tier has limits)
✅ Check for errors in console logs
✅ Verify MongoDB connection stability
```

---

## 🚀 Final Checklist

- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables added
- [ ] Bot is online on Render
- [ ] UptimeRobot monitor created
- [ ] Interval set to 5 minutes
- [ ] Health endpoint responding
- [ ] MongoDB connected
- [ ] All commands working
- [ ] Bot stays online 24/7 ✅

---

## 💡 Next Steps

1. **Invite bot to Discord server**
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
   ```

2. **Test commands in Discord**
   ```
   /rank
   /leaderboard
   /give @user 100
   /warn @user "spam"
   /autorole set @member
   ```

3. **Monitor bot health**
   - Check Render logs daily
   - Monitor UptimeRobot stats
   - Handle any alerts

---

**ProLeveling is now running 24/7 on the cloud!** 🌍✅

For questions: Check MEE6_FEATURES.md for command documentation

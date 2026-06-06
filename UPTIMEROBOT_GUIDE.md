# 🤖 UptimeRobot Setup Guide - Keep Bot Running 24/7

## ⚡ Tại sao cần UptimeRobot?

Render.com free tier sẽ **tự động tắt** ứng dụng sau 15 phút không có request.

UptimeRobot giải quyết vấn đề này bằng cách **gửi request mỗi 5 phút**, giữ app **luôn sống**.

```
15 phút không request → Render tắt app
↓
UptimeRobot ping → App khởi động lại
↓
5 phút sau → UptimeRobot ping tiếp
↓
Bot sống 24/7 ✅
```

---

## 📝 Step-by-Step Setup UptimeRobot

### Bước 1: Tạo Tài Khoản
1. Truy cập: https://uptimerobot.com
2. Click "Sign Up"
3. Nhập email + tạo password
4. Verify email qua link trong hộp thư

### Bước 2: Tạo Monitor Mới
1. Đăng nhập vào UptimeRobot
2. Click **"Add New Monitor"** (icon +)
3. Chọn **"HTTP(s)"**

### Bước 3: Cấu Hình Monitor

```
┌─ Monitor Configuration ─┐
│                         │
│ Monitor Type: HTTP(s)   │ ← Đã chọn
│                         │
│ Friendly Name:          │
│ ProLeveling Bot         │
│                         │
│ URL:                    │
│ https://proleveling.    │
│ onrender.com/health     │ ← THAY ĐỔI tên app
│                         │
│ HTTP Method: GET        │ ← Mặc định
│                         │
│ Monitoring Interval:    │
│ 5 minutes              │ ← ⭐ QUAN TRỌNG
│                         │
│ Alert Contacts:         │
│ [Email của bạn]        │ ← (Optional)
│                         │
└─────────────────────────┘
```

### Bước 4: Điền Chi Tiết

**Friendly Name:**
```
ProLeveling Bot
```

**URL (QUAN TRỌNG - Thay tên app của bạn):**
```
https://proleveling.onrender.com/health
```

Nếu app Render bạn tên khác (ví dụ: `my-bot`):
```
https://my-bot.onrender.com/health
```

**HTTP Method:**
```
GET (mặc định)
```

**Monitoring Interval:**
```
⭐ 5 minutes ← QUAN TRỌNG!
```

**Alert Contacts (tùy chọn):**
```
✅ Add your email để nhận cảnh báo khi bot offline
```

### Bước 5: Tạo Monitor
Click **"Create Monitor"** → Xong!

---

## ✅ Xác Minh Hoạt Động

### Cách 1: Kiểm tra UptimeRobot
1. Quay lại dashboard UptimeRobot
2. Monitor của bạn sẽ hiển thị:
   ```
   Status: UP ✅
   Response Time: ~500ms
   Last Check: Just now
   ```

### Cách 2: Kiểm tra Render Logs
1. Truy cập Render dashboard: https://render.com
2. Click vào service `proleveling`
3. Mở tab **"Logs"**
4. Bạn sẽ thấy các request từ UptimeRobot:
   ```
   GET /health HTTP/1.1" 200
   GET /health HTTP/1.1" 200
   GET /health HTTP/1.1" 200
   ↑ Mỗi 5 phút một request
   ```

### Cách 3: Test Manual
Mở trình duyệt hoặc terminal:
```bash
curl https://proleveling.onrender.com/health
```

Kết quả:
```json
{
  "status": "ok",
  "timestamp": "2026-06-06T10:30:45.123Z"
}
```

---

## 📊 Giám Sát UptimeRobot

### Dashboard View
```
Monitor Status: UP ✅
Uptime: 99.9%
Average Response Time: 523ms
Last Checked: 2 minutes ago
Next Check: 3 minutes
```

### Xem Lịch Sử Ping
1. Click vào monitor
2. Tab "Graph" → Xem ping history
3. Tab "Logs" → Chi tiết mỗi request

### Bật Thông Báo
1. Click monitor
2. "Alert Contacts" → Add email
3. Bạn sẽ nhận email nếu bot offline

---

## 🚨 Nếu Có Vấn Đề

### Monitor shows "DOWN" ❌

**Nguyên nhân 1: Render app chưa khởi động**
```
→ Chờ vài phút, Render sẽ khởi động lại
→ UptimeRobot sẽ ping → Thành công
```

**Nguyên nhân 2: Health endpoint không hoạt động**
```
→ Check Render logs
→ Bot có crash không?
→ MongoDB connect được không?
```

**Nguyên nhân 3: URL sai**
```
→ Verify URL: https://APP_NAME.onrender.com/health
→ APP_NAME phải trùng với tên Render service
```

### Monitor shows "UP" nhưng bot offline Discord ❌

```
→ UptimeRobot chỉ ping health endpoint
→ Không có nghĩa Discord connection sống
→ Check Render logs xem bot có error không
→ Verify DISCORD_TOKEN có đúng không
```

### Response Time rất chậm 🐢

```
→ Bình thường - Render free tier chậm hơn
→ Nếu > 30 giây → Check Render CPU
→ Monitor.js quá nặng → Optimize code
```

---

## 💡 Pro Tips

### Tip 1: Multiple Monitors
Tạo thêm monitor cho **hệ thống khác**:
```
Monitor 1: /health (generic health check)
Monitor 2: /rank (API test)
Monitor 3: /leaderboard (API test)
```

### Tip 2: Cảnh Báo Nâng Cao
- **Email alerts** khi bot offline
- **SMS alerts** (bản pro)
- **Webhook alerts** (tích hợp Discord)

### Tip 3: Tracking Uptime
```
UptimeRobot free tier:
- 50 monitors
- 5 minute interval
- 99.9% uptime tracking
- Email alerts
```

### Tip 4: Webhook vào Discord (Advanced)
```
1. Tạo webhook Discord trong #alerts
2. UptimeRobot → Alert Settings
3. Add Webhook URL
4. Bot sẽ báo offline/online trong Discord
```

---

## 📈 Kết Quả Sau Setup

### Trước (không UptimeRobot)
```
🟢 Bot online
↓ (15 phút không request)
🔴 Render tắt app
↓ (chờ ai request)
😞 Users: "Bot offline"
```

### Sau (có UptimeRobot)
```
🟢 Bot online
↓ (15 phút không request)
📡 UptimeRobot ping
↓
🟢 Bot vẫn online
↓ (5 phút sau)
📡 UptimeRobot ping lại
↓
🟢 Bot luôn online 24/7 ✅
```

---

## 🎯 Final Checklist

- [ ] UptimeRobot account tạo xong
- [ ] Monitor tạo thành công
- [ ] URL: https://APP.onrender.com/health
- [ ] Interval: 5 minutes
- [ ] Monitor status: UP ✅
- [ ] Render logs có request từ UptimeRobot
- [ ] Health endpoint responding 200 OK
- [ ] Email alerts configured (optional)

---

## 📞 Support

**UptimeRobot Issues?**
- Check: https://docs.uptimerobot.com
- Contact: support@uptimerobot.com

**Render Issues?**
- Check: https://render.com/docs
- Contact: support@render.com

**Bot Issues?**
- Check: Render logs tab
- Verify: MongoDB connection
- Test: `/rank` command on Discord

---

**Bot đang chạy 24/7 trên cloud!** 🚀✅

Uptime tracking: https://uptimerobot.com (dashboard)
App logs: https://render.com (dashboard)

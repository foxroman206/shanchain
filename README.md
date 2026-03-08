# GoodChain 後端 API

Node.js + Express + SQLite 後端，支援完整的善鏈功能。

## 快速啟動

```bash
# 1. 安裝依賴
npm install

# 2. 建立資料庫並植入測試資料
npm run seed

# 3. 啟動伺服器（開發模式，支援 hot reload）
npm run dev
```

伺服器啟動於 http://localhost:3001

## 測試帳號

| 角色  | 信箱                    | 密碼       |
|-------|-------------------------|-----------|
| Admin | admin@goodchain.tw      | demo1234  |
| User  | demo@goodchain.tw       | demo1234  |
| NGO   | ngo@redcross.org.tw     | demo1234  |

---

## API 文件

### 🔐 認證 (Auth)

```
POST /auth/register          建立帳號（信箱/密碼）
POST /auth/login             登入
POST /auth/send-otp          發送手機 OTP（回傳 debug_otp 供測試）
POST /auth/verify-otp        驗證 OTP 並登入
GET  /auth/me                取得目前用戶資料 + 勳章 + 捐款統計
PATCH /auth/me               更新名稱或長者模式
```

#### 登入範例
```json
POST /auth/login
{ "email": "demo@goodchain.tw", "password": "demo1234" }

回應：{ "token": "eyJ...", "user": { "id": "...", "name": "陳小明", ... } }
```

---

### 📋 專案 (Projects)

```
GET  /projects               取得所有專案（?category=教育&sort=score&search=花蓮）
GET  /projects/:id           專案詳情 + 里程碑 + 最近捐款人
POST /projects               建立新專案（需登入）
PATCH /projects/:id          更新專案（需為建立者或 admin）
GET  /projects/:id/milestones  里程碑列表
POST /projects/:id/milestones/:msId/complete  標記里程碑完成（需 admin）
```

---

### 💰 捐款 (Donations)

```
POST /donations              建立捐款（自動更新專案金額、發放勳章、計算積分）
GET  /donations              我的捐款記錄（需登入）
GET  /donations/project/:id  專案公開捐款串流
```

#### 捐款範例
```json
POST /donations
Headers: Authorization: Bearer <token>
{
  "project_id": "proj_flood",
  "amount": 1000,
  "method": "card",
  "method_tab": "fiat",
  "is_anonymous": false,
  "want_nft": true
}
```

---

### 🏛️ DAO 治理 (DAO)

```
GET  /dao/proposals          取得提案列表（?status=active）
GET  /dao/proposals/:id      提案詳情 + 最近投票記錄
POST /dao/proposals          建立新提案（需登入）
POST /dao/proposals/:id/vote 投票（yes/no/abstain，需登入，每人限投一次）
POST /dao/proposals/:id/freeze 執行合約凍結（需 admin，需投票通過 50%）
```

---

### 🤖 AI 引擎 (AI)

```
GET  /ai/stats               即時統計（掃描次數、保護金額、待處理警報）
GET  /ai/alerts              風險警報列表
POST /ai/alerts/:id/resolve  標記警報已處理（需 admin）
POST /ai/score/:projectId    重新計算 AI 評分（需 admin）
GET  /ai/weights             AI 模型權重說明
```

---

### ⚡ WebSocket 即時推播

連接 ws://localhost:3001/ws

接收事件格式：
```json
{ "type": "donation", "donation": { ... } }
{ "type": "ticker", "msg": "🟢 新捐款：花蓮水災..." }
{ "type": "connected", "message": "..." }
```

訂閱特定專案推播：
```json
{ "type": "subscribe", "projectId": "proj_flood" }
```

---

## 資料庫結構

- **users** – 用戶帳號、積分、等級
- **projects** – 公益專案、AI 評分、合約地址
- **donations** – 捐款記錄、交易 hash
- **milestones** – 里程碑、完成照片
- **dao_proposals** – DAO 提案、投票計數
- **dao_votes** – 個別投票記錄
- **ai_alerts** – AI 風險警報
- **badges** – 用戶勳章

## 正式部署注意事項

1. 修改 .env 中的 `JWT_SECRET` 為強密碼
2. 移除 `/auth/send-otp` 回應中的 `debug_otp`
3. 接入真實 SMS 服務（建議 Twilio）
4. 接入真實支付閘道（綠界、藍新）
5. 將 SQLite 換成 PostgreSQL（修改 db.js 使用 pg）
6. 加入 HTTPS / Nginx 反向代理

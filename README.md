# 六個月計劃（Netlify + Neon 版）

## 架構
```
Browser → Netlify Identity (Auth)
Browser → Netlify Functions → Neon PostgreSQL (資料)
```

---

## 設定步驟

### 一、啟用 Netlify Identity
1. Netlify 後台 → 你的 Site → **Identity** tab
2. 點 **Enable Identity**
3. 在 **Registration** 選 "Invite only"（只有你自己用）或 Open
4. 在 **External providers** 或 **Email** 確認 Magic Link 已開啟
5. 在 **Git Gateway** 不需要開啟

### 二、連接 Neon 資料庫
Neon 已經透過 Netlify 整合，取得 DATABASE_URL：
1. Netlify 後台 → **Integrations** → Neon → 你的資料庫
2. 複製 **Connection string**（格式：`postgres://user:pass@host/dbname`）
3. Netlify 後台 → **Site settings → Environment variables** → 新增：
   - Key: `DATABASE_URL`
   - Value: 貼上 connection string

### 三、部署
```bash
npm install
npm run build
```
直接 push 到 GitHub，Netlify 自動部署。

或本地測試（需要 netlify-cli）：
```bash
npm run dev   # 啟動 netlify dev，會模擬 Functions 和 Identity
```

---

## 登入流程
1. 打開網站 → 點「登入/註冊」
2. 輸入你的 email → 收到 Magic Link → 點擊 → 自動登入
3. 任何裝置登入同個 email，進度完全同步

## 資料庫
Table `planner_progress` 由 Function 自動建立（第一次呼叫時），不需要手動執行 SQL。

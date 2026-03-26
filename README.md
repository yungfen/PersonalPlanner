# 六個月計劃 — 部署指南

## 一、Supabase 設定（5 分鐘）

1. 前往 [supabase.com](https://supabase.com) → 建立免費帳號 → New Project
2. 記下：
   - Project URL（格式：`https://xxxxxx.supabase.co`）
   - anon/public API Key（在 Project Settings → API）
3. 前往 **SQL Editor** → 貼上 `supabase-setup.sql` 的內容 → 執行
4. 前往 **Authentication → URL Configuration**：
   - 在 Site URL 填入你的 Netlify 網址（先填 `http://localhost:5173`，之後更新）
   - Redirect URLs 加入同樣的網址

---

## 二、本地測試

```bash
# 複製環境變數
cp .env.example .env

# 填入你的 Supabase 資訊
# VITE_SUPABASE_URL=https://xxxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJh...

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

---

## 三、部署到 Netlify（3 分鐘）

### 方法 A：拖曳部署（最快）
```bash
npm run build
```
然後將 `dist/` 資料夾拖曳到 [netlify.com/drop](https://app.netlify.com/drop)

### 方法 B：GitHub + 自動部署（推薦）
1. 將這個資料夾 push 到 GitHub
2. 前往 [netlify.com](https://netlify.com) → Add new site → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. 在 **Site settings → Environment variables** 加入：
   - `VITE_SUPABASE_URL` = 你的 Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = 你的 anon key
6. 部署完成後，回到 Supabase → Authentication → URL Configuration，更新 Site URL 為 Netlify 網址

---

## 功能說明

- **Magic Link 登入**：輸入 email → 點擊信件連結 → 自動登入，不需要密碼
- **跨裝置同步**：任何裝置登入同個 email，進度完全同步
- **自動儲存**：打勾後 1.2 秒自動同步到雲端，右上角顯示同步狀態

## 技術架構

- Frontend: React + Vite
- 資料庫: Supabase (PostgreSQL)
- 認證: Supabase Auth (Magic Link)
- 部署: Netlify

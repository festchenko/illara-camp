# Telegram Mini App Deploy (Vercel + Render)

## 1) API on Render
1. Push repo to GitHub.
2. In Render: New → Web Service → Connect repo.
3. Root Directory: `apps/api`
4. Build Command: `pnpm install --frozen-lockfile && pnpm build`
5. Start Command: `node dist/index.js`
6. Set env var `NODE_VERSION=20` (others not required).
7. Deploy → copy the public URL (e.g., `https://illara-api.onrender.com`).

## 2) Web on Vercel
1. In Vercel: New Project → Import the same repo.
2. Set **Root Directory** to `apps/webapp`.
3. Vercel will pick up `vercel.json` (Vite). Add Environment Variable:
   - `VITE_API_URL = https://<your Render API URL>`
4. Deploy → get a URL like `https://illara-miniapp.vercel.app`.

## 3) Telegram BotFather
1. Create a bot via @BotFather → `/newbot` (save token).
2. Bot Settings → **Menu Button** → **Set Web App**:
   - Title: `Illara`
   - URL: `https://<your Vercel web URL>`
3. (Optional) Add `?v=timestamp` to bust cache during tests.

## 4) Test
- Open the bot on iOS/Android Telegram → tap the menu button → WebApp opens.
- The WebApp calls API at `VITE_API_URL` (HTTPS required).
- If you test locally instead, use ngrok:
  - `ngrok http 5173` → set this as WebApp URL in BotFather
  - `ngrok http 5175` → put this into `VITE_API_URL` and rebuild.

## Notes
- SPA routing: handled by `rewrites` in `vercel.json`.
- CORS is enabled in API code; OK for MVP.
- For production, add Telegram WebApp initData validation on the API.

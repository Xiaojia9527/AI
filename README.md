<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14Sh6SvTBzn3Jkw7TOb8agwXAo2psGPSs

## Run Locally

**Prerequisites:** Node.js (>=18)

1. Install dependencies:
   `npm install`
2. Copy `.env.local.example` to `.env.local` and set **GEMINI_API_KEY** and **GEMINI_API_URL**. _Do not commit `.env.local` to version control._
3. Run the app in development:
   `npm run dev`

> ⚠️ **Security note:** The app now uses a server-side API route to call Gemini. Keep `GEMINI_API_KEY` in `.env.local` and never expose it in client-side code or bundler configs.

---

## Server-side AI usage

The repository exposes a secure server-side endpoint at `/api/ai` (implemented in `app/api/ai/route.ts`). Your frontend should send prompts to this endpoint. The server reads `GEMINI_API_KEY` from environment variables and forwards requests to the configured `GEMINI_API_URL` — the key never appears in the client bundle.

Example (client-side):

```js
const res = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: '请优化下面的投资报告：...' })
});
const data = await res.json();
```

## Deploying

- For Vercel: add `GEMINI_API_KEY` and `GEMINI_API_URL` to your project Environment Variables in the Vercel dashboard.
- For other hosts: ensure `.env` or environment variables are set on the server and not committed to your repo.

---

**Tip:** Double-check other build configs (e.g., `vite.config.ts`) and remove any lines that inject environment secrets into client bundles.

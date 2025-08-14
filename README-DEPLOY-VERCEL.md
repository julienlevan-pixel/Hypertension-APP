# Deploying to Vercel (Static Vite + CSV rewrite)

This project uses Vite for the React client and originally served `/api/questions` from an Express server.
For Vercel, we deploy the client as a **static site** and rewrite `/api/questions` to the static CSV.

## What I changed
- **`client/public/questions.csv`**: CSV is now in `public/` so it's served at `/questions.csv`.
- **`vercel.json`**: Rewrites `GET /api/questions` → `/questions.csv` (static).
- **`package.json`**: Added `build:vercel` (runs only `vite build`).

## One‑time setup
1. Push this folder to a **new GitHub repo**.
2. In Vercel:
   - **New Project → Import** your repo
   - **Framework**: Vite (auto-detected)
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `dist/public`
   - Deploy

## Update the questions
Edit `client/public/questions.csv` in GitHub → commit → Vercel auto‑deploys.
The app fetches from `/api/questions` which is rewritten to `/questions.csv`.

## Local dev (optional)
```bash
npm install
npm run dev        # starts the Express+Vite dev server (as before)
npm run build      # builds client + bundles server (not used on Vercel)
npm run build:vercel  # builds client only for Vercel static deploy
```

If later you add features needing a real backend (auth, leaderboard, DB), switch to Vercel Serverless Functions in `/api/` or a separate hosted API.

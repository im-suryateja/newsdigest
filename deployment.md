# Deployment Guide

## Overview

| Component | Platform | Free tier |
|---|---|---|
| Backend API | Railway | ✅ Yes |
| Web frontend | Vercel | ✅ Yes |
| Database | Firebase Firestore | ✅ Yes |
| Mobile app | Expo / TestFlight | ✅ Yes (Expo Go) |

---

## Step 1 — Push to GitHub

```bash
cd newsdigest

# Initialize git
git init
git add .
git commit -m "feat: initial NewsDigest codebase"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/newsdigest.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Set up Firebase

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `newsdigest`
3. Disable Google Analytics (not needed)
4. Go to **Build → Firestore Database → Create database**
   - Choose **Start in production mode**
   - Pick a region close to you (e.g. `us-central`)
5. Go to **Project Settings → Service accounts**
6. Click **Generate new private key** → download the JSON file
7. You'll need these values for your backend `.env`:
   - `FIREBASE_PROJECT_ID` — from the JSON (`project_id`)
   - `FIREBASE_CLIENT_EMAIL` — from the JSON (`client_email`)
   - `FIREBASE_PRIVATE_KEY` — from the JSON (`private_key`)

### Firestore indexes needed

Create these composite indexes in Firebase Console → Firestore → Indexes:

```
Collection: news_articles
Fields: region (ASC), category (ASC), publishedAt (DESC)

Collection: refresh_log
Fields: status (ASC), timestamp (DESC)
```

---

## Step 3 — Get a NewsAPI key

1. Go to https://newsapi.org/register
2. Sign up for free
3. Copy your API key → paste into `NEWS_API_KEY` in your `.env`

Free tier: 100 requests/day, 1 request/second.
Your app makes 66 requests per daily refresh (6 regions × 11 categories) — well within limits.

---

## Step 4 — Deploy the Backend to Railway

1. Go to https://railway.app and sign up
2. Click **New Project → Deploy from GitHub repo**
3. Select your `newsdigest` repo
4. Set the **root directory** to `/backend`
5. Add environment variables (copy from your `.env`):
   - All variables from `backend/.env.example`
   - Set `NODE_ENV=production`
   - Set `CORS_ORIGIN=https://YOUR-VERCEL-APP.vercel.app` (update after step 5)
6. Railway will auto-detect Node.js and run `npm start`
7. Note your Railway URL: `https://YOUR-APP.railway.app`

---

## Step 5 — Deploy the Web Frontend to Vercel

1. Go to https://vercel.com and sign up
2. Click **Add New → Project → Import Git Repository**
3. Select your `newsdigest` repo
4. Set **Root Directory** to `web`
5. Add environment variable:
   - `VITE_API_URL` = `https://YOUR-APP.railway.app/api`
6. Click **Deploy**
7. Note your Vercel URL

Go back to Railway and update `CORS_ORIGIN` to your Vercel URL.

---

## Step 6 — Trigger the first data refresh

Once backend is deployed, trigger the first news fetch:

```bash
curl -X POST https://YOUR-APP.railway.app/api/admin/refresh \
  -H "x-admin-secret: YOUR_ADMIN_SECRET"
```

Or simply visit your Vercel URL — if no data exists, the UI will show an empty state with a message.

In development, you can also run:
```bash
cd backend
curl -X POST http://localhost:4000/api/admin/refresh
```

The refresh takes about 10–15 minutes on first run (66 API calls + LLM summarization with rate limit delays).

---

## Step 7 — Mobile app (Expo)

### Development (Expo Go — instant, no build needed)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone.
Update `BASE_URL` in `mobile/src/services/api.ts` to your Railway URL.

### Production build (TestFlight / Play Store)

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Configure
cd mobile
eas build:configure

# Build for iOS (requires Apple Developer account — $99/year)
eas build --platform ios

# Build for Android (free)
eas build --platform android
```

---

## Environment Variables Reference

### Backend (backend/.env)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default 4000) |
| `NODE_ENV` | Yes | `development` or `production` |
| `FIREBASE_PROJECT_ID` | Yes | From Firebase service account JSON |
| `FIREBASE_CLIENT_EMAIL` | Yes | From Firebase service account JSON |
| `FIREBASE_PRIVATE_KEY` | Yes | From Firebase service account JSON |
| `NEWS_API_KEY` | Yes | From newsapi.org |
| `LLM_PROVIDER` | Yes | `claude`, `openai`, or `gemini` |
| `ANTHROPIC_API_KEY` | Yes (if using Claude) | From console.anthropic.com |
| `OPENAI_API_KEY` | No | For future swap |
| `GEMINI_API_KEY` | No | For future swap |
| `CORS_ORIGIN` | Yes | Your Vercel URL in production |
| `CRON_SCHEDULE` | No | Default: `0 8 * * *` (midnight PST) |
| `ADMIN_SECRET` | Yes (prod) | Any strong random string |

### Web (web/.env or Vercel env vars)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Your Railway backend URL + `/api` |

---

## Rollback

```bash
# Railway: go to your deployment → Deployments → click previous → Redeploy
# Vercel: go to your project → Deployments → click previous → Promote to Production
```

---

## Monitoring

Railway and Vercel both provide built-in logs:
- Railway: Project → Deployments → View logs
- The backend logs every refresh with article counts and timing
- Check `GET /api/status` to see when the last successful refresh ran

---

## Swapping the LLM

1. Get an API key for OpenAI or Gemini
2. Update `.env`:
   ```
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your_key
   ```
3. Redeploy — no code changes needed

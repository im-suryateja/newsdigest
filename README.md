# NewsDigest

A curated daily news digest app — cross-platform (web + mobile) — delivering the top 3 stories per category per region, summarized into 3–4 paragraphs from reputable sources, with live stock prices for major global markets.

## Project Structure

```
newsdigest/
├── backend/          # Node.js + Express API server
├── web/              # React web application
├── mobile/           # React Native mobile application
└── docs/             # Architecture and API documentation
```

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Firebase project (free tier)
- NewsAPI.org API key (free tier)
- Anthropic Claude API key

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/newsdigest.git
cd newsdigest

# Install backend deps
cd backend && npm install

# Install web deps
cd ../web && npm install

# Install mobile deps
cd ../mobile && npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` in the backend folder and fill in your keys:

```bash
cd backend
cp .env.example .env
```

### 3. Run locally

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Web
cd web && npm run dev

# Terminal 3 — Mobile (optional)
cd mobile && npx expo start
```

## Tech Stack

| Layer | Technology |
|---|---|
| Web Frontend | React 18 + Vite + TypeScript |
| Mobile | React Native + Expo |
| Backend | Node.js + Express + TypeScript |
| Database | Firebase Firestore (free tier) |
| Scheduling | node-cron (midnight PST daily) |
| News API | NewsAPI.org (free tier) |
| Summarization | Claude API (LLM adapter — swappable) |
| Stock Data | yahoo-finance2 (free, no key needed) |
| Hosting | Railway (backend) + Vercel (web) |

## Deployment

See [docs/deployment.md](docs/deployment.md) for full step-by-step hosting instructions.

## Adding New Sources

Edit `backend/src/config/sources.ts` — no code changes needed elsewhere.

## Swapping LLM Provider

Edit `backend/src/config/llm.ts` and set `LLM_PROVIDER` in your `.env` to `claude`, `openai`, or `gemini`.

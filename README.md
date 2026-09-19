# Auto-Commenter (CommentPro)

An AI-powered SaaS web app that automates LinkedIn commenting. It finds relevant LinkedIn posts based on your keywords and the profiles you follow, then writes personalized comments in your own voice using a RAG (retrieval-augmented generation) loop over your past comments. Every comment is proposed for review before it is published.

> **Tagline:** Save time by automating your interactions on LinkedIn. Our AI writes personalized comments that match your style and voice.

## Features

- **AI comment generation** — Finds recent (last 24h) LinkedIn posts matching your keywords or from profiles you follow, filters by language/length, and generates comments with OpenAI GPT-4.1.
- **Your tone, your voice** — Learns from a description of your style plus examples of your previous comments, stored as vectors and reused as few-shot context (RAG).
- **Validation before publishing** — Comments arrive as proposals you can edit, summarize (3 key points), accept, or reject.
- **Scheduled posting** — Accepted comments are published at randomized times to keep activity natural.
- **LinkedIn account connection** — Connects through Unipile's hosted auth flow and syncs your recent comments on connect.
- **Subscription billing** — Stripe Checkout, billing portal, and webhooks manage plans and daily comment quotas.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack), React 19, TypeScript |
| Styling / UI | Tailwind CSS v4, shadcn/ui + Radix UI, Framer Motion, Lucide, next-themes |
| Database | [Supabase](https://supabase.com) (Postgres) |
| Auth | Supabase Auth (SSR cookie sessions, email OTP) |
| AI | OpenAI `gpt-4.1` (generation, summarization) and `text-embedding-ada-002` (embeddings) |
| Vector DB | [Qdrant](https://qdrant.tech) (`comment_history` collection) |
| LinkedIn | [Unipile](https://www.unipile.com) API |
| Language detection | [DetectLanguage](https://detectlanguage.com) |
| Payments | Stripe subscriptions + billing portal |
| Email | Nodemailer over Gmail SMTP |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file at the project root (it is git-ignored). Fill in the values listed in the [Environment Variables](#environment-variables) section below.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. External services

The app expects the following to be provisioned:

- A **Supabase** project with the tables `unipile_id`, `keywords`, `accounts`, `comment_proposal`, `comment_time`, and `user_timezone`.
- A **Qdrant** cluster with a `comment_history` collection.
- **Unipile**, **Stripe**, **OpenAI**, and **DetectLanguage** accounts and API keys.
- An external scheduler (e.g. n8n) to call `POST /api/post-comment` for approved comments, and the Vercel Cron configured in `vercel.json` for the daily job.

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_ENV` | `development` to use localhost URLs instead of the production URL. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key. |
| `NEXT_SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server-side admin lookups only). |
| `OPENAI_API_KEY` | OpenAI key for GPT-4.1 chat completions and embeddings. |
| `QDRANT_CLUSTER_LINK` | Qdrant cluster URL. |
| `QDRANT_CLUSTER_API_KEY` | Qdrant API key. |
| `UNIPILE_API_KEY` | Unipile API key (LinkedIn accounts, search, posts, comments). |
| `DETECT_LANGUAGE_API_KEY` | DetectLanguage API key for post language detection. |
| `STRIPE_SECRET_KEY` | Stripe server secret key. |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret. |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key (client-side). |
| `NEXT_PUBLIC_STRIPE_TARIF_10_ID` | Stripe price ID for the monthly plan. |
| `NEXT_PUBLIC_STRIPE_TARIF_90_ID` | Stripe price ID for the annual plan. |
| `NEXT_PUBLIC_STRIPE_TARIF_20_ID` | Stripe price ID for the Professional plan (optional). |
| `NEXT_PUBLIC_STRIPE_TARIF_180_ID` | Stripe price ID for the annual Professional plan (optional). |
| `TRIG_TASK_KEY` | Bearer secret protecting `/api/generate-com`, `/api/post-comment`, and `/api/summarize`. |
| `CRON_SECRET` | Bearer secret protecting `/api/cron` and `/api/update-comments`. |
| `GMAIL_APP_CODE` | Gmail app password used by Nodemailer for notifications. |

> **Never commit `.env.local` or any real credentials.** Rotate any key that may have been exposed.

## Scripts

```bash
npm run dev     # Start the dev server (Turbopack)
npm run build   # Production build
npm run start   # Start the production server
npm run lint    # Run ESLint
```

## API Routes

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/generate-com` | Bearer `TRIG_TASK_KEY` | Core generation: searches LinkedIn via Unipile, filters posts, and inserts AI comment proposals. |
| `POST` | `/api/post-comment` | Bearer `TRIG_TASK_KEY` | Publishes an approved comment to LinkedIn and stores the pair in Qdrant. |
| `POST` | `/api/update-comments` | Bearer `CRON_SECRET` | Re-ingests the user's recent comments to keep the tone model fresh. |
| `GET` | `/api/cron` | Bearer `CRON_SECRET` | Daily Vercel Cron: schedules randomized posting times and refreshes comments. |
| `POST` | `/api/summarize` | Bearer `TRIG_TASK_KEY` | Summarizes a post into 3 key points. |
| `POST` | `/api/unipile` | Unipile webhook | Handles account connection/reconnection callbacks. |
| `POST` | `/api/stripe/checkout` | Supabase session | Creates a Stripe Checkout session. |
| `POST` | `/api/stripe/create-portal-session` | Supabase session | Creates a Stripe billing-portal session. |
| `POST` | `/api/stripe/handle-webhook` | Stripe signature | Handles subscription lifecycle events. |
| `GET` | `/(auth)/auth/confirm` | Supabase OTP token | Email confirmation callback. |

## Project Structure

```
app/
├── (auth)/          # Login, signup, email confirmation
├── dashboard/       # Settings, comment suggestions, purchase credits
└── api/             # Route handlers (generation, posting, cron, unipile, stripe)
components/
├── landing/         # Marketing landing sections
├── dashboard/       # Dashboard UI (keywords, accounts, tone, proposals)
├── confirm-email/   # Email confirmation UI
└── ui/              # shadcn/ui primitives
utils/
├── supabase/        # Auth, queries, SSR client/middleware
├── unipile/         # LinkedIn queries
├── qdrant/          # Vector search queries
├── stripe/          # Webhook helpers
└── mailer/          # Email helpers
```

## Deployment

The project is designed to deploy on [Vercel](https://vercel.com). Configure all environment variables in your Vercel project settings. The daily cron job is declared in `vercel.json`:

```json
{ "crons": [{ "path": "/api/cron", "schedule": "0 0 * * *" }] }
```

## License

Private project. All rights reserved.

# AgriLink

A React + Vite + TypeScript agricultural marketplace app.

This project is now fully independent from Lovable infrastructure and uses:

- Supabase (Auth, Database, Storage, Edge Functions)
- Stripe (Checkout + Webhook)
- Groq AI API (via Supabase Edge Function)

## Tech Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase JS

## Environment Variables

Create or update `.env` in project root:

```env
VITE_SUPABASE_PROJECT_ID="fpoveaavxxpxendzpmpc"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_pG_3x_ua8z0eNwNl7pJm2Q_bmp5IUwN"
VITE_SUPABASE_URL="https://fpoveaavxxpxendzpmpc.supabase.co"
```

## Local Development

```bash
npm install
npm run dev
```

App runs on:

- http://localhost:8080

## Build for Production

```bash
npm run build
```

Build output goes to `dist/`.

## Supabase Setup

This repo is linked to project ref:

- `fpoveaavxxpxendzpmpc`

If linking again:

```bash
npx supabase login
npx supabase link --project-ref fpoveaavxxpxendzpmpc
```

Apply migrations:

```bash
npx supabase db push
```

## Edge Functions

Functions in this repo:

- `ai-chat`
- `create-checkout`
- `stripe-webhook`

Deploy:

```bash
npx supabase functions deploy ai-chat
npx supabase functions deploy create-checkout
npx supabase functions deploy stripe-webhook
```

List deployed functions:

```bash
npx supabase functions list
```

## Required Supabase Secrets

Set these in Supabase Dashboard -> Edge Functions -> Secrets:

- `GROQ_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended) or `SERVICE_ROLE_KEY`

Notes:

- `ai-chat` uses `GROQ_API_KEY` with model `llama-3.3-70b-versatile`.
- `stripe-webhook` supports both `SUPABASE_SERVICE_ROLE_KEY` and `SERVICE_ROLE_KEY`.

## Stripe Webhook

Configured webhook endpoint:

- `https://fpoveaavxxpxendzpmpc.supabase.co/functions/v1/stripe-webhook`

Required event:

- `checkout.session.completed`

When Stripe confirms payment, the webhook updates `orders`:

- `status` -> `paid`
- `stripe_payment_id` -> payment intent id

## Docker Usage

Build image:

```bash
docker build -t agrilink-web .
```

Run container:

```bash
docker run --rm -p 8080:80 agrilink-web
```

Open:

- http://localhost:8080

Important:

- Docker image serves static frontend only via Nginx.
- Supabase and Stripe remain external services.

## Troubleshooting

If `npx supabase db push` fails with existing-object errors:

1. Check migration state:

```bash
npx supabase migration list
```

2. Repair already-applied migrations:

```bash
npx supabase migration repair --status applied 20260225140926
npx supabase migration repair --status applied 20260225144738
npx supabase migration repair --status applied 20260225164003
```

3. Push again:

```bash
npx supabase db push
```

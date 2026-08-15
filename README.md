<div align="center">

# 🌾 AgriLink

### Smart Agriculture Marketplace — connecting farmers and buyers through secure auth, role-based dashboards, and Stripe-powered checkout.

[![Live](https://img.shields.io/badge/Live-agrilink--09r5.onrender.com-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://agrilink-09r5.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](./Dockerfile)

<br />

AgriLink is a production-style agri-commerce platform that brings farmers, buyers, and admins into one secure marketplace — with AI-assisted support, role-based dashboards, and an end-to-end Stripe checkout flow.

[🚀 Live Demo](https://agrilink-09r5.onrender.com) · [🐛 Report Bug](https://github.com/sakawatkabir13/AgriLink/issues) · [✨ Request Feature](https://github.com/sakawatkabir13/AgriLink/issues)

</div>

---

## 📑 Table of Contents

1. [✨ Features](#-features)
2. [🖼️ Screenshots](#-screenshots)
3. [🧱 Tech Stack](#-tech-stack)
4. [🏗️ Architecture](#-architecture)
5. [🚀 Quick Start](#-quick-start)
6. [🧪 Available Scripts](#-available-scripts)
7. [📁 Project Structure](#-project-structure)
8. [🔐 Environment Variables](#-environment-variables)
9. [� Docker Deployment](#-docker-deployment)
10. [🤝 Contributing](#-contributing)
11. [🛡️ Security](#-security)
12. [📄 License](#-license)
13. [🙏 Acknowledgements](#-acknowledgements)

---

## ✨ Features

### � For Buyers
- 🌾 Browse a rich marketplace of crop listings with search and filters
- �️ Persistent cart with quantity, totals, and stock validation
- 💳 Secure checkout via **Stripe Checkout** with webhooks for order fulfillment
- 📦 Full **order history** with per-order status tracking
- 🤖 **AI chatbot assistant** for product and platform help
- 📱 Fully responsive across desktop, tablet, and mobile

### 👨‍🌾 For Farmers
- 🧑‍💼 Dedicated **Farmer Dashboard** for inventory and order management
- ➕ Submit products for admin approval before going live
- 📈 Track sales, active listings, and pending approvals
- 🆙 Self-service **upgrade to farmer** flow from a buyer account

### 🛡️ For Admins
- 🧭 Centralized **Admin Dashboard** for moderation
- ✅ Approve / reject farmer listings and role upgrade requests
- 👀 Visibility into user roles and the order lifecycle

### 🔐 Platform-Wide
- 🔑 Email + password auth via **Supabase Auth** with RLS-protected tables
- 🔁 Password reset and forgot-password flows
- 🧩 Modular component library built on **shadcn/ui + Radix**
- ⚡ Code-split routes with **React Router v6**
- 🧪 Unit tests with **Vitest** + **Testing Library**
- 🎨 Theming and design tokens with **Tailwind CSS**

---

## 🖼️ Screenshots

> Add real screenshots to `docs/screenshots/` and replace these paths after the first deploy.

| Landing | Marketplace |
| :---: | :---: |
| ![Landing](./docs/screenshots/landing.png) | ![Marketplace](./docs/screenshots/marketplace.png) |

| Farmer Dashboard | Admin Dashboard |
| :---: | :---: |
| ![Farmer Dashboard](./docs/screenshots/farmer-dashboard.png) | ![Admin Dashboard](./docs/screenshots/admin-dashboard.png) |

| Cart & Checkout | AI Chatbot |
| :---: | :---: |
| ![Checkout](./docs/screenshots/checkout.png) | ![AI Chatbot](./docs/screenshots/ai-chatbot.png) |

---

## 🧱 Tech Stack

### Frontend
| Layer | Technology |
| --- | --- |
| Framework | **React 18** |
| Language | **TypeScript 5** |
| Build tool | **Vite 5** |
| Styling | **Tailwind CSS 3** + CSS variables |
| Components | **shadcn/ui** on **Radix UI** primitives |
| Routing | **React Router v6** |
| Forms | **React Hook Form** + **Zod** resolvers |
| Data fetching | **TanStack Query v5** |
| Charts | **Recharts** |
| Icons | **Lucide React** |
| Toasts | **Sonner** |

### Backend & Services
| Service | Purpose |
| --- | --- |
| **Supabase** | Auth, Postgres database, Row-Level Security, Edge Functions |
| **Stripe** | Hosted Checkout + Webhooks for order lifecycle |
| **LLM provider** (via Edge Function) | Powers the `ai-chat` assistant |
| **Render** | Web + static hosting |
| **Nginx** | Production reverse proxy / static server (Docker image) |

### Tooling
- **ESLint 9** (flat config) + `typescript-eslint`
- **Vitest** + **Testing Library** + **jsdom**
- **PostCSS** + **Autoprefixer**
- **Docker** multi-stage build (`node:18-alpine` → `nginx:alpine`)

---

## 🏗️ Architecture

```
┌──────────────────┐    HTTPS    ┌────────────────────┐
│   React + Vite   │ ──────────► │  Stripe Checkout   │
│  (Browser SPA)   │ ◄─────────  │   (hosted page)    │
└────────┬─────────┘   redirect  └────────┬───────────┘
         │                                │ webhook
         │ REST / Realtime                ▼
         ▼
┌──────────────────────────────────────────────────────┐
│                  Supabase Platform                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │
│  │   Auth     │  │ Postgres + │  │ Edge Functions │  │
│  │  (RLS)     │  │   RLS      │  │ • ai-chat      │  │
│  │            │  │            │  │ • stripe-webhook│ │
│  │            │  │            │  │ • create-checkout│ │
│  │            │  │            │  │ • approve-farmer│ │
│  └────────────┘  └────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Key flows**
- **Auth & roles** — Supabase issues JWTs; Postgres RLS policies gate tables (`profiles`, `products`, `orders`) by role (`buyer`, `farmer`, `admin`).
- **Checkout** — Client calls the `create-checkout` Edge Function → redirects to Stripe → Stripe posts to `stripe-webhook` → order is finalized.
- **AI chat** — Browser calls the `ai-chat` Edge Function with conversation history; function proxies to the configured LLM provider.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm 9+**
- A free **Supabase** project
- A **Stripe** test account

### 1. Clone the repository

```bash
git clone https://github.com/sakawatkabir13/AgriLink.git
cd AgriLink
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file at the project root:

```bash
cp .env.example .env   # if .env.example is provided
# otherwise, create .env manually:
```

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 4. Run the dev server

```bash
npm run dev
```

The app runs at **http://localhost:8080**.

---

## 🧪 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Build using development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

---

## 📁 Project Structure

```
AgriLink/
├── src/
│   ├── components/        # Reusable UI + feature components
│   │   ├── ui/            # shadcn/ui primitives (button, dialog, …)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── AIChatbot.tsx
│   │   └── NavLink.tsx
│   ├── pages/             # Route-level views
│   │   ├── Index.tsx              # Landing
│   │   ├── Marketplace.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── PaymentSuccess.tsx
│   │   ├── OrderHistory.tsx
│   │   ├── Login.tsx / Register.tsx
│   │   ├── ForgotPassword.tsx / ResetPassword.tsx
│   │   ├── FarmerDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── UpgradeToFarmer.tsx
│   │   ├── About.tsx / Privacy.tsx / Terms.tsx
│   │   └── NotFound.tsx
│   ├── context/           # React context providers (Auth, Cart)
│   ├── hooks/             # Custom hooks (use-toast, use-mobile)
│   ├── integrations/
│   │   └── supabase/      # Typed Supabase client
│   ├── data/              # Static / seed data
│   ├── lib/               # Utilities (cn, formatters)
│   ├── types/             # Shared TypeScript types
│   ├── test/              # Vitest setup + tests
│   ├── assets/            # Bundled images, icons
│   ├── App.tsx            # Router + providers
│   └── main.tsx           # Entry point
├── supabase/
│   ├── functions/         # Edge Functions
│   │   ├── ai-chat/
│   │   ├── approve-farmer/
│   │   ├── create-checkout/
│   │   └── stripe-webhook/
│   ├── migrations/        # SQL migrations (schema + RLS)
│   └── config.toml
├── public/                # Static assets served as-is
├── Dockerfile             # Multi-stage build (Vite → Nginx)
├── nginx.conf             # SPA-friendly routing
├── tailwind.config.ts
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
└── package.json
```

---

## 🔐 Environment Variables

All variables exposed to the client **must** be prefixed with `VITE_`.

| Variable | Required | Description |
| --- | :---: | --- |
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon (public) key — safe in client |
| `STRIPE_SECRET_KEY` | ⚙️ server | Stripe secret key (Edge Function only) |
| `STRIPE_WEBHOOK_SECRET` | ⚙️ server | Stripe webhook signing secret |
| `OPENAI_API_KEY` *(or chosen LLM)* | ⚙️ server | Used by `ai-chat` Edge Function |

> Never commit secrets. Use Render / Supabase environment settings for server-side values.

---

## 🐳 Docker Deployment

AgriLink ships a multi-stage Dockerfile that builds with Node 18 and serves with Nginx.

```bash
# Build the image
docker build -t agrilink .

# Run on http://localhost:8080
docker run -p 8080:80 agrilink
```

Nginx is configured for **SPA fallback** so client-side routes (`/marketplace`, `/dashboard`, …) work on hard refresh.

---

## 🤝 Contributing

Contributions are welcome and appreciated 💚

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feat/awesome-thing`
3. Commit your changes: `git commit -m "feat: add awesome thing"`
4. Push: `git push origin feat/awesome-thing`
5. Open a **Pull Request**

Please make sure:
- ✅ `npm run lint` passes
- ✅ `npm run test` passes
- ✅ New features include a test where reasonable
- ✅ You follow the existing code style (ESLint defaults)

---

## 🛡️ Security

If you discover a security vulnerability, **please do not open a public issue**. Instead, contact the maintainer directly through GitHub so it can be triaged responsibly.

---

## 📄 License

This project is licensed under the **MIT License** — see the [`LICENSE`](./LICENSE) file for details.

© 2026 **Sakawat Kabir**

---

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com) — beautiful, accessible primitives
- [Radix UI](https://www.radix-ui.com) — unstyled, accessible component foundations
- [Supabase](https://supabase.com) — auth, DB, and serverless functions
- [Stripe](https://stripe.com) — payments infrastructure
- [Lucide](https://lucide.dev) — open-source icon set
- [Vite](https://vitejs.dev) + [React](https://react.dev) — fast, modern tooling

---

## 👥 Contributors

This is a group project, built by a team of three:

<!-- ALL-CONTRIBUTORS-LIST:START -->
| Name | Role / Focus | GitHub |
| :--- | :--- | :---: |
| **Mohammad Sakawat Kabir** | Project lead & full-stack | [@sakawatkabir13](https://github.com/sakawatkabir13) |
| **Abdur Rashid Raj** | Frontend & marketplace | [@Asimpleman420](https://github.com/Asimpleman420) |
| **Olid Hussan Opu** | Auth, dashboards & admin flows | [@olid-opu](https://github.com/olid-opu) |
<!-- ALL-CONTRIBUTORS-LIST:END -->

If you'd like to join in, see the [Contributing guide](./CONTRIBUTING.md).

---

<div align="center">

⭐ **If you find this project useful, please consider giving it a star!** ⭐

Made with 🌱 by the [AgriLink team](#-contributors)

</div>

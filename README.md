# AgriLink: Smart Agriculture Marketplace (React + Vite + TypeScript)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend%20Build-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI%20Styling-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend%20Services-3ECF8E?logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)
![Render](https://img.shields.io/badge/Hosted%20on-Render-46E3B7?logo=render&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Web%20App-0A0A0A)

A production-ready agriculture marketplace platform that connects farmers and buyers through secure authentication, product discovery, streamlined checkout, and role-based dashboard workflows.

---

## Live Deployment

- Production URL: https://agrilink-09r5.onrender.com

---

## Project Overview

AgriLink is built for modern agri-commerce use cases, including:

- Product browsing with rich marketplace listings
- Shopping cart and payment flow
- Authentication-enabled user journeys
- Farmer dashboard and admin management views
- AI chatbot assistance for user support
- Responsive experience across desktop and mobile

---

## Technology Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Services and Infrastructure

- Supabase (authentication and data services)
- Stripe (checkout and payments)
- Render (application hosting)

---

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Clone and Run Locally

```bash
git clone https://github.com/sakawatkabir13/AgriLink.git
cd AgriLink
npm install
npm run dev
```

The app will be available at:

- http://localhost:8080

---

## Available Commands

- `npm run dev`: Start local development server
- `npm run build`: Create optimized production build
- `npm run preview`: Preview production build locally
- `npm run test`: Run test suite
- `npm run lint`: Run lint checks

---

## Project Structure

```text
AgriLink/
  src/
    components/      # Reusable UI and feature components
    pages/           # Route-level views
    context/         # State providers and shared context
    hooks/           # Custom React hooks
    data/            # Static data sources
    integrations/    # External service integrations
    test/            # Test setup and test files
  public/            # Static assets
  supabase/          # Supabase resources and migrations
```

---

## Deployment Status

The latest deployed version is live on Render:

- https://agrilink-09r5.onrender.com

---

## Notes

- This README focuses on frontend usage and local execution.
- Backend service setup details are intentionally excluded.

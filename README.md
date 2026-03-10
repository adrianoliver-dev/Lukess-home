# Lukess Home — E-commerce Platform

A full-stack e-commerce platform built for a retail clothing brand in Santa Cruz de la Sierra, Bolivia.
Developed as a solo project in 30 days.

🔗 **Live Demo:** [lukess-home.vercel.app](https://lukess-home.vercel.app)

## Features

- Product catalog with filters (category, size, color)
- Shopping cart with persistent state
- Checkout flow with GPS-based delivery address
- WhatsApp order confirmation integration
- Transactional emails via Resend
- Mobile-first responsive design
- SEO optimized (metadata, sitemap, robots.txt)
- Lighthouse Performance score 90+

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | Tailwind CSS v4 |
| Email | Resend |
| Deployment | Vercel |

## Architecture

- **App Router** with Server Components for data fetching
- **Row Level Security (RLS)** on all Supabase tables
- **Server Actions** for cart and checkout mutations
- **Optimistic UI** for cart interactions

## Getting Started

```bash
git clone https://github.com/adrianoliver-dev/lukess-home
cd lukess-home
npm install
cp .env.example .env.local
# Fill in your Supabase and Resend credentials
npm run dev
Environment Variables
text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
Developer
Adrian Oliver · adrianoliver.dev · Santa Cruz de la Sierra, Bolivia


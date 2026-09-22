# Step by Step English

A PraDigi programme web project. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

This is an independent project — not related to tfipack.org, the TFI Pune Alumni Chapter site, or their Supabase/Vercel projects.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in this project's own Supabase credentials (do not reuse another project's).

## Folder structure

- `src/app` — routes (App Router)
- `src/components` — shared UI components
- `src/lib` — client setup, utilities, data access
- `src/types` — shared TypeScript types
- `public/images` — static image assets

## Deployment

Deploys to its own Vercel project with its own domain (not a tfipack.org subdomain).

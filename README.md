# Band for Band

Band for Band is a discovery and ranking platform for HBCU marching-band
performances. This repository currently contains the production-ready discovery
foundation: the performance feed, leaderboard, school directory, and school
profiles backed by realistic sample data.

## Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Supabase Postgres and Auth
- Drizzle ORM
- Mux video upload and playback
- Radix UI primitives

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The discovery experience runs without provider credentials. Supabase, database,
and Mux operations require the corresponding values in `.env.local`.

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run lint
npm run typecheck
npm run build
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:seed-hbcus
npm run db:seed-school-identities
```

## Provider setup

1. Create a Supabase project and copy its project URL, publishable key, and
   Postgres pooler connection string.
2. Create a Mux environment and copy its token ID, token secret, and webhook
   signing secret.
3. Add those values to `.env.local`.
4. Apply `supabase/migrations/20260717150000_auth_profiles.sql`.

For authentication:

- Enable Email and Google under Supabase Authentication providers.
- Add `http://localhost:3000/auth/callback` as a local redirect URL.
- Add the production `/auth/callback` URL before deploying.
- Use the Supabase session pooler connection string for `DATABASE_URL`. The
  direct database hostname is IPv6-only and may not work on every network.

Never expose the Mux token secret or database connection string to the browser.

## HBCU directory data

`npm run db:seed-hbcus` idempotently imports the accredited HBCU directory
published by the U.S. Department of Education. Verified marching-band names are
maintained separately in the seed script with a source URL for each program.
Schools without a verified active band remain available for member affiliation
but are excluded from performance uploads.

`npm run db:seed-school-identities` fills abbreviation, conference, and school
colors for every HBCU from sourced identity files in `scripts/data/`.

## Product context

`PRODUCT.md` captures product strategy and `DESIGN.md` captures the visual
system. The architecture and user-story documents supplied for the project
remain the source of truth for the full MVP.

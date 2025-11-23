# TinyLink - Starter Repo

This is a starter Next.js project for the TinyLink take-home assignment (URL shortener).

**What it contains**
- Next.js app (pages router)
- API routes for `/api/links` and `/api/links/:code`
- Redirect route `/:code`
- Health endpoint `/healthz`
- Postgres DB helper (`lib/db.js`)
- Tailwind config and minimal CSS
- Migration SQL `scripts/migrate.sql`
- The original assignment PDF has been copied into the repo at `assets/assignment.pdf` (source path: /mnt/data/Take-Home Assignment_ TinyLink (1) (2).pdf)

**How to run locally**
1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and `BASE_URL`.
2. Install dependencies: `npm install`
3. Create the database table (execute `scripts/migrate.sql` against your Postgres DB).
4. Start dev server: `npm run dev`
5. API endpoints:
   - `POST /api/links` - create link (409 if code exists)
   - `GET /api/links` - list links
   - `GET /api/links/:code` - stats for a code
   - `DELETE /api/links/:code` - delete a code
   - `GET /:code` - redirect to original URL (302) or 404 if missing
   - `GET /healthz` - health check (200 JSON)

**Files of interest**
- `pages/api/links/index.js`
- `pages/api/links/[code].js`
- `pages/[code].js`
- `pages/index.js` (dashboard)
- `pages/code/[code].js` (stats page)
- `lib/db.js` - Postgres client
- `scripts/migrate.sql` - create table SQL

**Notes**
- This is a starter template. UI is minimal but functional — tweak styles and UX as you like.
- The uploaded assignment PDF was included at `assets/assignment.pdf` for reference.

---

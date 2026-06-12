# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Phase 0 — Scaffold & specs complete. Ready to start Phase 1.

## Current Goal

- Finalize specs, then build Member management (create + list).

## Completed

- Project scaffold (Next.js 15 + TS + Tailwind + Prisma + Baileys deps).
- `npm install` done.
- Prisma schema drafted: `Person` + `Payment` (one payment per member/month).
- `.gitignore`, `.env.example`, README created.
- WhatsApp boundary stub (`src/lib/whatsapp.ts`) with simulate mode.
- All six context files filled in; CLAUDE.md rewritten as entry point.

## In Progress

- None.

## Next Up

1. Run `npm run db:migrate` against a local Postgres to create tables.
2. Phase 1 — Member management: `POST /api/persons`, `GET /api/persons`,
   add-member form, members table.
3. Phase 2 — Payment entry: `POST /api/payments`, payment form with
   editable `Date Received`, confirmation message (simulate).
4. Phase 3 — Reminder cron + filtering + Excel export.

## Open Questions

- **Auth**: single-admin assumed for the demo. Does the senior want a login
  (e.g. simple password / Clerk) before launch? — confirm with senior.
- **Month range**: which months should the export/grid cover — a fixed year
  (Jan–Dec 2026) or a rolling range? — confirm.
- **WhatsApp go-live**: stay on simulate for the demo; when do we provision
  a real Baileys session number? — confirm.

## Architecture Decisions

- Chose Next.js (one project for UI + API) over React+Express split —
  simpler deploy, one language, matches the template's stack hint.
- Two-table data model (Person + Payment) instead of 48 monthly columns —
  cleaner queries; the wide month layout is reconstructed only at export.
- WhatsApp via Baileys behind a single module — free for the demo, swappable
  to the official API later without touching callers.

## Session Notes

- Stack confirmed implicitly by running `npm install` on the generated
  package.json. Senior's explicit confirmation on auth/month-range still
  pending (see Open Questions).
- Postgres connection not yet configured — `DATABASE_URL` in `.env` must be
  set before `db:migrate`.

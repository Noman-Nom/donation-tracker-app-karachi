# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Phase 2 complete. Ready to start Phase 3 (reminders + filters + export).

## Current Goal

- Build Phase 3: daily reminder check, filters, and Excel export.

## Completed

- Project scaffold (Next.js 15 + TS + Tailwind + Prisma + Baileys deps).
- `npm install` done.
- Prisma schema: `Person` + `Payment` (one payment per member/month),
  with `directUrl` configured for Neon migrations.
- `.gitignore`, `.env.example`, README created.
- WhatsApp boundary stub (`src/lib/whatsapp.ts`) with simulate mode.
- All six context files filled in; CLAUDE.md rewritten as entry point.
- Neon Postgres connected; initial migration applied (tables created).
- Phase 1 — Member management: `GET`/`POST /api/persons` (zod-validated),
  add-member form + members table. Verified end to end. Build passes.
- Phase 2 — Payment entry: `GET`/`POST /api/payments` (upsert, one per
  member/month), payment form (member + month dropdown, amount, editable
  Date Received), immediate WhatsApp confirmation (simulate), payments
  table. Shared nav (Members / Payments). Verified end to end (POST 201,
  msgSent true, confirmation logged, validation 400). Build passes.

## In Progress

- None.

## Next Up

1. Phase 3a — Reminder logic: daily check after the 15th for unpaid
   members → send reminder, set notified, record reminderDate.
2. Phase 3b — Filters: by department, month, payment status, date range.
3. Phase 3c — Excel export in the wide month-column format.

## Notes for next session

- A test member ("Ali Khan", Finance) exists in the DB from the Phase 1
  smoke test — harmless sample data; delete when convenient.

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

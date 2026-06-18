# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Phase 3a (reminders) + 3c (export) complete. Remaining: filters (3b),
  then a UI polish pass.

## Current Goal

- Build Phase 3b: filters (department, month, payment status, date range).

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

- Phase 3c — Excel export: `GET /api/export` builds a wide-format .xlsx
  (54 cols: 6 base + 12 months × {Amount, Date, Msg, Notified}) via SheetJS.
  "Export to Excel" button in the header. Verified (valid xlsx, 54 cols).
- Phase 3a — Reminders: `runReminderCheck()` in src/server/cron/reminders.ts
  (after-15th gate, force option), exposed via `POST /api/reminders/run`.
  "Run reminder check" button + "Notified" column on Payments page.
  Verified: sends to unpaid only, skips paid, idempotent on re-run.
  Build passes.
- Real WhatsApp send (proof): `scripts/whatsapp-test.mjs` connects via
  Baileys and sends a real message after a one-time QR scan. Verified to the
  QR/handshake stage. Added dep `qrcode-terminal`; npm scripts `test:api`
  and `wa:test`. NOT yet wired into the app — app still uses simulate mode.

## In Progress

- None.

## Next Up

1. Phase 3b — Filters: by department, month, payment status, date range.
2. UI polish pass (use the web-design-guidelines skill).

## Notes

- Reminder cron is manual-trigger only for the demo. For production, wire
  `runReminderCheck()` to node-cron (needs a long-running server) or a
  scheduled job / external cron hitting `POST /api/reminders/run`.
- Baileys live-send learnings (needed when wiring the "live" branch of
  `src/lib/whatsapp.ts`): (1) Baileys is CommonJS — factory is
  `baileys.default`; (2) needs a global `crypto` polyfill on older Node
  (`globalThis.crypto = webcrypto`); (3) must pass `version` from
  `fetchLatestBaileysVersion()` or WhatsApp rejects the handshake; (4) the
  connection must stay alive across requests — run as a separate WhatsApp
  worker process, not inside a Next.js request handler.

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
- Neon Postgres is connected and migrated. `.env` holds `DATABASE_URL`
  (pooled) + `DIRECT_URL` (direct, for migrations). The DB password was
  shared in plaintext during setup — rotate it in Neon before production.

# Architecture Context

## Stack

| Layer     | Technology                       | Role                                   |
| --------- | -------------------------------- | -------------------------------------- |
| Framework | Next.js 15 (App Router) + TS     | Frontend + API routes in one project   |
| UI        | Tailwind CSS                     | Styling; tokens defined in ui-context  |
| Database  | PostgreSQL + Prisma              | Members, payments, relationships       |
| Messaging | Baileys (`@whiskeysockets/baileys`) | WhatsApp send (simulate by default) |
| Scheduler | node-cron                        | Daily reminder check                    |
| Export    | SheetJS (`xlsx`)                 | Excel export in wide month format       |

## System Boundaries

- `src/app/` — routes (pages) and `api/` route handlers. Handlers validate
  input, call services, and return JSON. No business logic inline.
- `src/components/` — React UI only (ui/ primitives, members/, payments/).
  No direct database access from components.
- `src/lib/` — shared infrastructure: `db.ts` (Prisma client),
  `whatsapp.ts` (messaging boundary), `utils.ts`.
- `src/server/` — business logic (`services/`) and scheduled jobs (`cron/`).
- `prisma/` — schema and migrations.
- `scripts/` — standalone utilities run with `node`/npm, outside Next.js:
  `test-api.mjs` (`npm run test:api`) and `whatsapp-test.mjs`
  (`npm run wa:test`, real Baileys send proof).

## Storage Model

- **PostgreSQL (via Prisma)**: all persistent data.
  - `Person` — member identity + contact + department.
  - `Payment` — one row per member per month (`@@unique([personId, month])`)
    holding amount, date received, msgSent, notified, reminderDate.
- **Baileys auth session (filesystem)**: WhatsApp login credentials, stored
  in an ignored directory (`auth_session/`). Never committed, never in DB.

## Messaging Model

- All sends go through `src/lib/whatsapp.ts`.
- `WHATSAPP_MODE=simulate` (default) logs the message and sends nothing.
- `WHATSAPP_MODE=live` sends via Baileys. Switching modes must not require
  changes anywhere except this module.
- Baileys needs a long-lived connection (a QR-paired session that stays
  open). It must NOT run inside a Next.js request handler — the live
  integration is a separate WhatsApp worker process that `whatsapp.ts` talks
  to. A working standalone reference is `scripts/whatsapp-test.mjs`.

## Auth and Access Model

- Single-admin internal tool for the demo. No multi-user auth yet.
- If auth is added later, it is enforced in API route handlers before any
  mutation. (Open question — see progress-tracker.md.)

## Invariants

1. Components never access the database directly — only via API routes.
2. There is at most one `Payment` per `(personId, month)`.
3. All WhatsApp sends go through `src/lib/whatsapp.ts` — no direct Baileys
   calls elsewhere.
4. The Baileys auth session is never committed to git or stored in the DB.
5. API route handlers validate external input (zod) before any logic runs.
6. `npm run build` passes before a unit of work is considered done.

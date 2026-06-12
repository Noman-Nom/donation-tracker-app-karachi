# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes; do not layer workarounds.
- Do not mix unrelated concerns in one component or route.
- Name things for what they are: `PaymentForm`, `getOverdueMembers`.

## TypeScript

- Strict mode is required throughout (already set in tsconfig).
- Avoid `any` — use explicit interfaces or narrowly scoped types.
- Derive domain types from Prisma (`@prisma/client`) rather than redefining.
- Validate unknown external input at system boundaries before trusting it.

## Next.js (App Router)

- Default to Server Components. Add `"use client"` only when browser
  interactivity requires it (forms, filters, date pickers).
- Keep `app/api/*` route handlers focused: validate input → call a service
  → return a consistent JSON shape. No business logic inline.
- Use the `@/*` path alias for imports from `src/`.

## Styling

- Use the CSS custom property tokens from ui-context.md — no hardcoded hex.
- Follow the border-radius scale in ui-context.md.
- Use the `cn()` helper (`src/lib/utils.ts`) to compose class names.

## API Routes

- Parse and validate request input with zod before any logic runs.
- Return predictable shapes: `{ data }` on success, `{ error }` on failure,
  with appropriate HTTP status codes.
- (When auth is added) enforce auth before any mutation.

## Data and Storage

- All persistent data lives in PostgreSQL via Prisma.
- Access the database only through `src/lib/db.ts` (the shared client).
- Never store WhatsApp session credentials in the database.
- Enforce one payment per `(personId, month)` at the DB level.

## Messaging

- Send WhatsApp only through `src/lib/whatsapp.ts`. No direct Baileys calls
  elsewhere.

## File Organization

- `src/app/` — routes and API handlers.
- `src/components/` — UI (ui/ primitives, members/, payments/).
- `src/lib/` — db, whatsapp, utils (shared infrastructure).
- `src/server/` — services (business logic) and cron (scheduled jobs).
- `prisma/` — schema and migrations.

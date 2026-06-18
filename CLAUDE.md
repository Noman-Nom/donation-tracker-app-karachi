# Member & Contribution Tracker

A web app to track organization members and their monthly contributions,
send WhatsApp confirmations and reminders, and export data to Excel.

## Stack (summary)

Next.js 15 (App Router) · TypeScript · Tailwind CSS · PostgreSQL · Prisma ·
Baileys (WhatsApp) · node-cron · SheetJS. Full detail in
`context/architecture.md`.

## Application Building Context

Read the following files in order before implementing
or making any architectural decision:

1. `context/project-overview.md` — product definition,
   goals, features, and scope
2. `context/architecture.md` — system structure,
   boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography,
   and component conventions
4. `context/code-standards.md` — implementation rules
   and conventions
5. `context/ai-workflow-rules.md` — development workflow,
   scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase,
   completed work, open questions, and next steps

Update `context/progress-tracker.md` after each
meaningful implementation change.

If implementation changes the architecture, scope, or
standards documented in the context files, update the
relevant file before continuing.

## Quick commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # production build (must pass before moving on)
npm run db:migrate   # apply Prisma schema to the database
npm run db:studio    # browse the database
npm run test:api     # smoke-test the API (dev server must be running)
npm run wa:test      # send a real WhatsApp message via Baileys (QR scan)
```

# Member & Contribution Tracker

Track organization members and their monthly contributions, with
WhatsApp confirmations and reminders, plus one-click Excel export.

> **Status:** scaffold ready. Stack pending senior confirmation
> (see `context/progress-tracker.md`). Built against `CLAUDE.md` +
> the `context/` spec files.

## Stack (proposed)

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 15 (App Router) + TypeScript |
| UI          | Tailwind CSS                        |
| Database    | PostgreSQL + Prisma                 |
| WhatsApp    | Baileys (free) — simulate by default |
| Scheduler   | node-cron                           |
| Excel export| SheetJS (`xlsx`)                    |

## Project structure

```
.
├── CLAUDE.md                 # Entry rules — read context files in order
├── context/                  # Spec files (overview, architecture, standards…)
├── prisma/
│   └── schema.prisma         # Person + Payment models
├── public/
├── src/
│   ├── app/                  # Next.js routes
│   │   ├── api/              # API route handlers (/persons, /payments, /export)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/               # Reusable primitives
│   │   ├── members/          # Member list / form
│   │   └── payments/         # Payment form / table
│   ├── lib/
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── whatsapp.ts       # Messaging boundary (simulate | live)
│   │   └── utils.ts
│   ├── server/
│   │   ├── services/         # Business logic
│   │   └── cron/             # Daily reminder check
│   └── types/
└── .env.example
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env        # then edit DATABASE_URL

# 3. Set up the database
npm run db:migrate          # creates tables from prisma/schema.prisma

# 4. Run the dev server
npm run dev                 # http://localhost:3000
```

## WhatsApp modes

- `WHATSAPP_MODE=simulate` (default) — logs messages, sends nothing. Free.
- `WHATSAPP_MODE=live` — sends via Baileys (requires a session number).

## Workflow

This project follows a spec-driven workflow. Before implementing any
feature, read the files listed in `CLAUDE.md`, and update
`context/progress-tracker.md` after each meaningful change.

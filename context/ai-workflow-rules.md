# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow. The context
files define what to build, how to build it, and the current state of
progress. Always implement against these specs — do not infer or invent
behavior from scratch. When something is unclear, resolve it in the context
files first, then implement.

## Scoping Rules

- Work on one feature unit at a time (e.g. "Member create", then
  "Payment entry", then "Reminder job").
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single step (e.g. don't
  build the UI form and the cron job in the same change).

## When to Split Work

Split an implementation step if it combines:

- UI changes and background/cron changes.
- Multiple unrelated API routes.
- Behavior not clearly defined in the context files.

If a change cannot be verified end to end quickly, the scope is too broad —
split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file
  before implementing.
- If a requirement is missing, add it as an open question in
  `progress-tracker.md` before continuing.

## Protected Files

Do not modify unless explicitly instructed:

- `prisma/migrations/*` — generated migration history.
- `.agents/skills/*` — installed agent skills.
- Generated files (`next-env.d.ts`, `.next/`, `node_modules/`).

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → `architecture.md`
- Storage model decisions → `architecture.md`
- Code conventions → `code-standards.md`
- Feature scope → `project-overview.md`
- UI tokens / patterns → `ui-context.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant in `architecture.md` was violated.
3. `progress-tracker.md` reflects the completed work.
4. `npm run build` passes.

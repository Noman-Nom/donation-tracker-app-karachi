# UI Context

## Theme

Light, clean, professional admin theme — this is a data tool used by an
admin to enter and read records, so clarity and legibility beat visual
flair. White/neutral surfaces, a single calm accent for actions, and clear
status colors for paid / unpaid / overdue.

## Colors

Define these as CSS custom properties in `src/app/globals.css`. All
components use these tokens — no hardcoded hex values.

| Role            | CSS Variable       | Value     |
| --------------- | ------------------ | --------- |
| Page background | `--bg-base`        | `#f8fafc` |
| Surface         | `--bg-surface`     | `#ffffff` |
| Primary text    | `--text-primary`   | `#0f172a` |
| Muted text      | `--text-muted`     | `#64748b` |
| Primary accent  | `--accent-primary` | `#2563eb` |
| Border          | `--border-default` | `#e2e8f0` |
| Error           | `--state-error`    | `#dc2626` |
| Success         | `--state-success`  | `#16a34a` |
| Warning         | `--state-warning`  | `#d97706` |

Status meaning: paid = success, unpaid = muted, overdue (blank after the
15th) = error (red row highlight).

## Typography

| Role      | Font                  | Variable      |
| --------- | --------------------- | ------------- |
| UI text   | system-ui / Geist Sans| `--font-sans` |
| Code/mono | ui-monospace          | `--font-mono` |

## Border Radius

| Context           | Class          |
| ----------------- | -------------- |
| Inline / small UI | `rounded-md`   |
| Cards / panels    | `rounded-lg`   |
| Modals / overlays | `rounded-xl`   |

## Component Library

Plain Tailwind components built in-house under `src/components/`. Shared
primitives (Button, Input, Select, Table, Badge) live in
`src/components/ui/`. Keep them small and composable. Icons: Lucide React,
stroke-based — `h-4 w-4` inline, `h-5 w-5` in buttons.

## Layout Patterns

- App shell: top navbar (title + export button) with a bottom border;
  main content area on `--bg-base`.
- Payment entry: a card form with a clear primary submit button.
- Members/payments: a table on a white surface; sticky/frozen first
  columns (Name, Department) while month columns scroll horizontally.
- Overdue rows: full-row tint using `--state-error` at low opacity.
- Modals: centered overlay with a dimmed backdrop.

## Accessibility

- All inputs have labels. Status is never communicated by color alone —
  pair color with text (e.g. "Unpaid").

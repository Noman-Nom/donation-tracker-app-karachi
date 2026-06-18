# UI Context

## Theme

Glassy, gradient, interactive dark theme. A deep gradient backdrop (indigo →
fuchsia → sky radial glows on a near-black base) with frosted-glass panels
(`backdrop-blur`, translucent white surfaces, subtle borders). Light text,
vibrant indigo→fuchsia gradient for primary actions, and colored status
badges. Motion is subtle (fade-in, hover scale) and respects
`prefers-reduced-motion`.

## Colors

Define these as CSS custom properties in `src/app/globals.css`. Text/state
colors use tokens; glass surfaces use white/opacity utilities directly.

| Role           | CSS Variable       | Value                      |
| -------------- | ------------------ | -------------------------- |
| Base bg        | (body)             | `#0a0e1f` + radial glows   |
| Glass surface  | `--bg-surface`     | `rgba(255,255,255,0.06)`   |
| Primary text   | `--text-primary`   | `#f1f5f9`                  |
| Muted text     | `--text-muted`     | `#94a3b8`                  |
| Accent (focus) | `--accent-primary` | `#818cf8`                  |
| Border         | `--border-default` | `rgba(255,255,255,0.12)`   |
| Error          | `--state-error`    | `#f87171`                  |
| Success        | `--state-success`  | `#34d399`                  |
| Warning        | `--state-warning`  | `#fbbf24`                  |

Primary action gradient: `from-indigo-500 to-fuchsia-500`.
Status badges: paid/sent = emerald, reminded = amber.

## Reusable component classes (globals.css)

- `.glass-card` — frosted panel (blur, translucent, rounded-2xl, shadow).
- `.input-field` — glass input with hover + `focus-visible` ring.
- `.btn-primary` — gradient button with hover-scale / active-scale.
- `.btn-ghost` — translucent secondary button.
- `.badge` — pill for status labels.

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

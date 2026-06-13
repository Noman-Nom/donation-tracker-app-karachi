import type { Config } from "tailwindcss";

// Semantic color tokens map to the CSS variables in globals.css.
// Use these (e.g. bg-surface, text-muted) — never hardcoded hex.
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        fg: "var(--text-primary)",
        muted: "var(--text-muted)",
        accent: "var(--accent-primary)",
        line: "var(--border-default)",
        error: "var(--state-error)",
        success: "var(--state-success)",
        warning: "var(--state-warning)",
      },
    },
  },
  plugins: [],
} satisfies Config;

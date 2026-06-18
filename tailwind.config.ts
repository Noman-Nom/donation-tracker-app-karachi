import type { Config } from "tailwindcss";

// Semantic color tokens map to the CSS variables in globals.css.
// Glass surfaces use white/opacity utilities directly in components.
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
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;

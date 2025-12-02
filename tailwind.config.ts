import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-spline-sans)", "sans-serif"],
        mono: ["var(--font-spline-sans)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "primary-bg": "var(--primary-background)",
        "secondary-bg": "var(--secondary-background)",
        "tertiary-bg": "var(--tertiary-background)",
        "card-bg": "var(--card-background)",
        "hover-bg": "var(--hover-background)",
        "reverse-bg": "var(--reverse-background)",
        "reverse-hover-bg": "var(--reverse-hover-background)",
        "primary-fg": "var(--primary-foreground)",
        "secondary-fg": "var(--secondary-foreground)",
        "tertiary-fg": "var(--tertiary-foreground)",
        "reverse-fg": "var(--reverse-foreground)",
        "border-new": "var(--border)",
      },
    },
  },
} satisfies Config



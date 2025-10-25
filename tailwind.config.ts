import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-spline-sans)", "sans-serif"],
        mono: ["var(--font-spline-sans)", "monospace"],
      },
      colors: {
        'gd-dark': '#0d0d0d',
        'gd-cream': '#feffe1',
      },
    },
  },
} satisfies Config



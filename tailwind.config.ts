import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Use CSS variables mapped from globals.css
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--brand-primary)",
          deep: "var(--brand-primary-deep)",
          foreground: "var(--brand-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--brand-secondary)",
          foreground: "var(--brand-secondary-foreground)",
        },
        surface: {
          DEFAULT: "var(--surface-default)",
          muted: "var(--surface-muted)",
          elevated: "var(--surface-elevated)",
        },
        border: "var(--border)",
        ring: "var(--ring)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animationDuration: {
        hover: "150ms",
        transition: "350ms",
        scroll: "650ms",
      },
      animationTimingFunction: {
        ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

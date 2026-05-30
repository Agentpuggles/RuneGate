import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Modern Fantasy Palette
        portal: {
          // Background layers
          bg: "#0a0e1a",
          "bg-elevated": "#0f1423",
          "bg-surface": "#141a2e",
          "bg-overlay": "#1a2138",

          // Gold accent system (brighter, more vibrant)
          gold: "#fbbf24",
          "gold-light": "#fcd34d",
          "gold-dark": "#f59e0b",
          "gold-muted": "#b45309",

          // Primary accent (emerald for growth/XP)
          emerald: "#10b981",
          "emerald-light": "#34d399",
          "emerald-dark": "#059669",

          // Secondary accents
          ruby: "#ef4444",
          "ruby-light": "#f87171",
          sapphire: "#3b82f6",
          "sapphire-light": "#60a5fa",
          amethyst: "#a855f7",
          "amethyst-light": "#c084fc",

          // Neutral tones
          "text-primary": "#f8fafc",
          "text-secondary": "#cbd5e1",
          "text-muted": "#64748b",
          "text-dim": "#475569",

          // Borders
          border: "#334155",
          "border-light": "#1e293b",
          "border-gold": "#fbbf24",

          // Legacy support
          cream: "#fef3c7",
          "cream-dim": "#d97706",
        },
      },
      fontFamily: {
        rune: ['"MedievalSharp"', "cursive"],
        mono: ['"JetBrains Mono"', "monospace"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      spacing: {
        "4.5": "1.125rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "glow-gold": "0 0 20px rgba(251, 191, 36, 0.3)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.3)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "panel": "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        float: "float 5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(251, 191, 36, 0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(251, 191, 36, 0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "shimmer-gradient": "linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d, #fbbf24, #f59e0b)",
      },
    },
  },
  plugins: [],
};

export default config;

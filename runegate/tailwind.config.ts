import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Retro 2000s Fantasy Palette
        guild: {
          // Backgrounds - deep blacks and dark purples
          bg: "#000000",
          "bg-alt": "#0a0a0f",
          "bg-panel": "#0d0d12",
          "bg-header": "#080810",

          // Gold system - classic MMO gold
          gold: "#d4af37",
          "gold-light": "#f0d060",
          "gold-dark": "#996515",
          "gold-glow": "#ffcc00",

          // Blood reds
          blood: "#8b0000",
          "blood-light": "#cc0000",
          "blood-dark": "#4a0000",

          // Classic fantasy colors
          emerald: "#00cc66",
          sapphire: "#3366cc",
          amethyst: "#9933cc",
          ruby: "#cc3333",
          topaz: "#ff9900",

          // Text colors
          text: "#c9b896",
          "text-light": "#ddccaa",
          "text-dim": "#666655",
          "text-bright": "#fff8dc",

          // Borders
          border: "#2a2a2a",
          "border-light": "#3a3a3a",
          "border-gold": "#d4af37",
          "border-dark": "#1a1a1a",

          // Special effects
          glow: "#ffff00",
          shadow: "#000033",
        },
      },
      fontFamily: {
        rune: ['"MedievalSharp"', "cursive"],
        mono: ['"Courier New"', "monospace"],
        display: ['"Times New Roman"', "serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      backgroundImage: {
        "diagonal-lines":
          "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(212, 175, 55, 0.03) 2px, rgba(212, 175, 55, 0.03) 4px)",
        "checker-dark":
          "repeating-conic-gradient(#0a0a0f 0% 25%, #050508 0% 50%) 50% / 20px 20px",
      },
      boxShadow: {
        "gold-glow": "0 0 10px rgba(212, 175, 55, 0.5), 0 0 20px rgba(212, 175, 55, 0.3)",
        "inner-gold": "inset 0 0 10px rgba(212, 175, 55, 0.2)",
        "retro": "3px 3px 0px #000000, 1px 1px 0px #333333",
      },
      animation: {
        "blink": "blink 1s step-end infinite",
        "marquee": "marquee 15s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        pulseGold: {
          "0%, 100%": { textShadow: "0 0 5px #d4af37" },
          "50%": { textShadow: "0 0 15px #d4af37, 0 0 25px #ffcc00" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

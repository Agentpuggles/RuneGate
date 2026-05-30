import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forum: {
          bg: "#0e0c15",
          mid: "#16132a",
          panel: "#1b1732",
          "panel-hover": "#221e3d",
          border: "#3d3560",
          "border-light": "#2a2545",
          gold: "#c9a84c",
          "gold-bright": "#ffd84d",
          "gold-dim": "#8a7234",
          cream: "#ddd2bc",
          "cream-dim": "#a89c86",
          text: "#ccc4b0",
          "text-dim": "#7a7268",
          "text-bright": "#f0e8d8",
          link: "#7ba5d0",
          green: "#5da06a",
          red: "#c45050",
          purple: "#8b6cc4",
          blue: "#5882b0",
          orange: "#c48840",
          brown: "#8a6d3b",
        },
      },
      fontFamily: {
        rune: ['"MedievalSharp"', "cursive"],
        mono: ['"JetBrains Mono"', "monospace"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        float: "float 5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

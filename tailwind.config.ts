import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sun: { DEFAULT: "#FF4D00", red: "#F52B0A", gold: "#F4B900", deep: "#C93A00" },
        gold: "#F4B900",
        cream: { DEFAULT: "#FFF7E8", dark: "#F6E7C9" },
        char: { DEFAULT: "#211A16", soft: "#3A2E27" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        cond: ["var(--font-display)", "Impact", "sans-serif"],
        serif2: ["var(--font-body)", "system-ui", "sans-serif"],
        nav: ["var(--font-nav)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

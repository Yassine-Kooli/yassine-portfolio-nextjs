/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./os/**/*.{ts,tsx}",
    "./apps/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: "#08090b",
        crypt: "#0f1114",
        ash: {
          900: "#14161a",
          800: "#1c1f24",
          700: "#2a2e35",
          600: "#3b4048",
          500: "#5b6270",
          400: "#7f8794",
          300: "#a3aab5",
        },
        bone: "#d6dae0",
        parchment: "#f5f6f8",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // `display` and `ui` are kept as aliases so existing components keep working
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        ui: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        window: "0 24px 60px -12px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.06)",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(10%)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: ".85" },
        },
        blink: { "50%": { opacity: "0" } },
      },
      animation: {
        drift: "drift 40s ease-in-out infinite alternate",
        "drift-slow": "drift 70s ease-in-out infinite alternate-reverse",
        flicker: "flicker 4s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};

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
        abyss: "#050505",
        crypt: "#0d0c0c",
        ash: {
          900: "#141313",
          800: "#1c1a1a",
          700: "#2a2727",
          600: "#3b3737",
          500: "#5a5454",
          400: "#7d7676",
          300: "#a39b9b",
        },
        bone: "#d9d1c1",
        parchment: "#efe8d8",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        goth: ["var(--font-goth)", "serif"],
        display: ["var(--font-display)", "serif"],
        ui: ["var(--font-ui)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
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

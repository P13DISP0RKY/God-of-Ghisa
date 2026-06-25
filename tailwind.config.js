import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        gold: "var(--gold)",
        cyan: "var(--cyan)",
        magenta: "var(--magenta)",
        violet: "var(--violet)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },
      fontFamily: {
        display: ['"Orbitron"', "system-ui", "sans-serif"],
        sans: ['"Rajdhani"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
        "4xl": "calc(var(--radius) + 16px)",
      },
      keyframes: {
        "rank-pop": {
          "0%": { transform: "scale(0.4) rotate(-12deg)", opacity: "0" },
          "55%": { transform: "scale(1.15) rotate(4deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0)", opacity: "1" },
        },
        "float-up": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0)" },
        },
        shine: {
          "0%": { "background-position": "-200% center" },
          "100%": { "background-position": "200% center" },
        },
        "pulse-ring": {
          "0%": { "box-shadow": "0 0 0 0 rgba(244, 63, 110, 0.55)" },
          "70%": { "box-shadow": "0 0 0 18px rgba(244, 63, 110, 0)" },
          "100%": { "box-shadow": "0 0 0 0 rgba(244, 63, 110, 0)" },
        },
      },
      animation: {
        "rank-pop": "rank-pop 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28) both",
        float: "float-up 3s ease-in-out infinite",
        shine: "shine 3s linear infinite",
        "pulse-glow": "pulse-ring 2s infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

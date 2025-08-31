import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html", // Bolt 側で必要なら残す
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Bolt + hermeln 両方カバー
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js App Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // 共通コンポーネント
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          50: "hsl(var(--surface-50))",
        },
        primary: {
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
        },
      },
    },
  },
  plugins: [],
};

export default config;

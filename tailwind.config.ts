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
        'dark-primary': '#0D0D0F',
        'dark-card': '#1A1A1E',
        'dark-elevated': '#1C1C20',
        'cta-primary': '#FF4D2A',
        'green-positive': '#00C853',
        'red-negative': '#FF3D3D',
      },
    },
  },
  plugins: [],
};

export default config;

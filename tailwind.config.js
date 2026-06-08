/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/theme/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hindSiliguri: ["var(--font-hindSiliguri)"],
        baiJamjuree: ["var(--font-baiJamjuree)", "var(--font-hindSiliguri)"],
      },
      colors: {
        // Orange and Blue theme from BuyBee logo
        primary: "#F28B23",
        primaryDark: "#D97B1E",
        accent: "#184166",
      },
    },
  },
  plugins: [],
};

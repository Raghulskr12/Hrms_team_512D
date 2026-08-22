/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F17',
          card: '#111827',
          header: '#131B2E',
          sidebar: '#0D1322',
          border: '#1E293B',
          hover: '#1F293D',
          subtext: '#94A3B8',
        },
        primary: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          light: '#8B5CF6',
          bg: '#2E1065',
        },
      },
    },
  },
  plugins: [],
};

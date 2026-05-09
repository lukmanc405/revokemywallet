/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F0F0F',
        'bg-card': '#1A1A1A',
        'bg-surface': '#262626',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        'accent': '#7C3AED',
        'accent-hover': '#6D28D9',
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Disable dark mode to prevent auto-switching based on system preferences
  darkMode: false,

  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      colors: {
        // Brand Colors - Traditional Medicine Theme
        brand: {
          primary: '#16a34a',      // Green 600 - Main brand color
          'primary-dark': '#15803d', // Green 700 - Hover states
          'primary-light': '#22c55e', // Green 500 - Accents
          secondary: '#065f46',     // Emerald 800 - Secondary actions
        },

        // Improved Gray Scale with Better Contrast
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',  // Tertiary text - good contrast
          600: '#4b5563',  // Secondary text - better contrast
          700: '#374151',  // Primary secondary text - excellent contrast
          800: '#1f2937',
          900: '#111827',  // Primary text - maximum contrast
          950: '#030712',
        },
      },

      // Add custom spacing if needed
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },

      // Add custom border radius
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },

  plugins: [],
}

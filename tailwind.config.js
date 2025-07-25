// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  // darkMode removed
  theme: {
    extend: {
      colors: {
        // Light theme palette, mimicking VisualCV's professional feel
        primary: { // Main accent blue
          DEFAULT: '#3b82f6', // blue-500
          light: '#60a5fa',   // blue-400
          dark: '#2563eb',    // blue-600
        },
        secondary: { // Complementary green
          DEFAULT: '#10b981', // emerald-500
          light: '#34d399',   // emerald-400
          dark: '#059669',    // emerald-600
        },
        text: { // Text colors for light mode
          DEFAULT: '#1f2937', // gray-900 - main text
          light: '#4b5563',   // gray-600 - secondary text/placeholder
        },
        background: { // Backgrounds for light mode
          DEFAULT: '#f9fafb', // gray-50 - main page background
          card: '#ffffff',    // white - card/panel background
          input: '#f3f4f6',   // gray-100 - input field background
        },
        border: {
          DEFAULT: '#e5e7eb', // gray-200 - for borders
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Keep Inter or choose another professional sans-serif
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'pulse-microphone': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite cubic-bezier(0.6, 0.01, 0.3, 0.9)', // Still for subtle effects if desired
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' },
        },
        blob: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
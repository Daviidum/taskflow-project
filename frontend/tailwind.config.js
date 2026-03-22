/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Rose/Pink
        rose: {
          50: '#fdf8ff',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f7a8b8',
          400: '#f085a2',
          500: '#e8849a',
          600: '#d0618a',
          700: '#b8407a',
          800: '#a0306a',
          900: '#88205a',
        },
        // Lavender/Purple
        lavender: {
          50: '#f8f7ff',
          100: '#f0ebff',
          200: '#e8e0ff',
          300: '#c4b5f4',
          400: '#b0a3f0',
          500: '#9b7fe8',
          600: '#8767d8',
          700: '#734fc0',
          800: '#5f37a8',
          900: '#4b1f90',
        },
        // Mint/Green
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#a8e6cf',
          400: '#6ee7b7',
          500: '#5fbf8d',
          600: '#34d399',
          700: '#10b981',
          800: '#059669',
          900: '#047857',
        },
        // Sky/Blue
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b3d9f7',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
        },
        // Peach/Orange
        peach: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#ffd6b0',
          300: '#ffba80',
          400: '#ff9850',
          500: '#fb923c',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
        },
        // Custom grays
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716f',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(140, 100, 200, 0.1)',
        'soft-lg': '0 8px 32px rgba(140, 100, 200, 0.18)',
        'lg-dark': '0 8px 32px rgba(140, 100, 200, 0.25)',
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #f0ebff, #fde8ef)',
        'gradient-purple-rose': 'linear-gradient(135deg, #c4b5f4, #f7a8b8)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}

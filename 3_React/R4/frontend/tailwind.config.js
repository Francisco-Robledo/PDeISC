/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        google: {
          blue: {
            DEFAULT: '#4285F4',
            light: '#E8F0FE',
            dark: '#8AB4F8',
            hover: '#1A73E8'
          },
          red: {
            DEFAULT: '#EA4335',
            light: '#FCE8E6',
            dark: '#F28B82',
            hover: '#D93025'
          },
          yellow: {
            DEFAULT: '#FBBC05',
            light: '#FEF7E0',
            dark: '#FDD663',
            hover: '#F9AB00'
          },
          green: {
            DEFAULT: '#34A853',
            light: '#E6F4EA',
            dark: '#81C995',
            hover: '#1E8E3E'
          },
          surface: {
            light: '#F8F9FA',
            dark: '#121212',
            cardLight: '#FFFFFF',
            cardDark: '#1E1F20',
            borderLight: '#E0E3E7',
            borderDark: '#2D2F31'
          }
        }
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Product Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
